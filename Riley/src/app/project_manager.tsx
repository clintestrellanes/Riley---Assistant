import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowUpDown,
  Plus,
  Filter,
  MoreHorizontal,
  Download,
  Upload, // NEW: Icon for import
  CheckSquare, // NEW: Icon for selected state
  Square, // NEW: Icon for unselected state
  X // NEW: Icon to clear selection
} from "lucide-react";

// components
import Dither from "@/components/Dither";
import SpotlightCard from "@/components/SpotlightCard";

// my components
import Chat from "./project_manager/chat";
import Sidebar from "./project_manager/sidebar";
import ModalContainerOptions from "./project_manager/modal.container.options";

import ContainerModal from "./project_manager/modal_container";
import NewContainer from "./project_manager/modal_new_container";
import ModalCreateNew from "./project_manager/modal.create.new";

// types
import type {
  project_content,
  all_projects,
  project,
} from "../types/project.types";

export default function ProjectManager() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // all projects
  const [all_projects, set_all_projects] = useState<all_projects>(() => {
    const savedProjects = localStorage.getItem("RileyProjects");
    if (savedProjects) {
      return JSON.parse(savedProjects);
    }
    return [];
  });

  // specific project
  const [active_project, set_active_project] = useState<project | null>(() => {
    if (all_projects.length > 0) {
      return all_projects[0];
    }
    return null;
  });

  // modals
  const [createNew, setCreateNew] = useState<boolean>(false);
  const [containerModalOpen, setContainerModalOpen] = useState<boolean>(false);
  const [newContainerModalOpen, setNewContainerModalOpen] =
    useState<boolean>(false);
  const [isContainerOptionOpen, setIsContainerOptionOpen] =
    useState<boolean>(false);

  const [active_project_content, set_active_project_content] =
    useState<project_content | null>(null);

  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProjects = () => {
    const savedProjects = JSON.parse(
      localStorage.getItem("RileyProjects") || "[]",
    );

    if (savedProjects && savedProjects.length > 0) {
      console.log("updated successfully");
      set_all_projects(savedProjects);

      if (active_project) {
        const updatedActiveProject = savedProjects.find(
          (p: project) => p.title === active_project.title, 
        );
        set_active_project(updatedActiveProject || savedProjects[0]);
      } else {
        set_active_project(savedProjects[0]);
      }
    } else {
      set_all_projects([]);
      set_active_project(null);
    }
  };

  const handleSaveProject = () => {
    const active_prj: project = active_project;

    if (!active_prj || active_prj === null) {
      alert("No projects to save!");
      return;
    }

    const blob = new Blob([JSON.stringify(active_prj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `RileyProjects_Project_Backup_${new Date().toISOString().split("T")[0]}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // NEW: Toggle container selection
  const toggleSelection = (title: string) => {
    setSelectedContainers((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  // NEW: Export ONLY selected containers
  const handleExportSelected = () => {
    if (selectedContainers.length === 0 || !active_project?.content) return;

    const containersToExport = active_project.content.filter((c) =>
      selectedContainers.includes(c.title)
    );

    const blob = new Blob([JSON.stringify(containersToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `RileyProjects_Containers_${new Date().toISOString().split("T")[0]}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Optional: Clear selection after exporting
    setSelectedContainers([]);
  };

  // NEW: Import specific containers
  const handleImportContainers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !active_project) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        
        // Basic validation to ensure it's an array of containers
        if (Array.isArray(importedData)) {
          const updatedActiveProject = {
            ...active_project,
            // Merge existing content with imported content
            content: [...(active_project.content || []), ...importedData],
          };

          const updatedProjects = all_projects.map((p) =>
            p.title === active_project.title ? updatedActiveProject : p
          );

          localStorage.setItem("RileyProjects", JSON.stringify(updatedProjects));
          handleUpdateProjects();
        } else {
          alert("Invalid file format. Please upload a valid containers JSON.");
        }
      } catch {
        alert("Failed to parse JSON file. Please check the format.");
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // router
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-950">
      <div className="absolute inset-0 z-0 opacity-80">
        <Dither
          waveColor={[0.1, 0.8, 0.9]}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0}
          colorNum={2.5}
          waveAmplitude={0}
          waveFrequency={0}
          waveSpeed={0.04}
        />
      </div>

      <div className="absolute inset-0 z-0 bg-gray-900/60 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-row h-full w-full">
        <Sidebar
          projects={all_projects}
          active_project={active_project!}
          set_active_project={(project) => {
            set_active_project(project);
          }}
          onUpdate={() => {
            handleUpdateProjects();
          }}
          updateActiveProject={(project) => {
            setSelectedContainers([]);
            set_active_project(project);
          }}
        />
        {!active_project ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 h-full overflow-hidden">
            {/* ... (Empty state remains exactly the same) ... */}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center p-6 sm:p-10 pb-32 h-full overflow-hidden">
            {/* --- Search & Sort Section --- */}
            <div className="w-full max-w-6xl flex flex-wrap sm:flex-nowrap items-center gap-3 mb-8">
              
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors duration-200" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 text-white placeholder:text-gray-500 hover:bg-white/10"
                />
              </div>

              <button className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 group">
                <ArrowUpDown className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </button>

              <button className="p-3 rounded-2xl bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/20 shadow-lg hover:bg-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 group">
                <Filter className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </button>

              {/* NEW: Import Button (Triggers hidden file input) */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 group"
                title="Import Containers"
              >
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
              </button>
              {/* Hidden File Input */}
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImportContainers}
              />

              <button
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 group flex items-center gap-2 border border-white/10"
                onClick={() => {
                  setCreateNew(true);
                }}
              >
                <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-white font-medium tracking-wide hidden sm:inline">
                  New
                </span>
              </button>
              
              <button
                onClick={handleSaveProject}
                className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Download all active project JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* NEW: Selection Action Bar (appears only when items are selected) */}
            {selectedContainers.length > 0 && (
              <div className="w-full max-w-6xl mb-6 flex items-center justify-between bg-cyan-500/20 border border-cyan-500/30 rounded-xl px-4 py-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
                <span className="text-cyan-300 font-medium">
                  {selectedContainers.length} container{selectedContainers.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={handleExportSelected}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Export Selected
                  </button>
                  <button
                    onClick={() => setSelectedContainers([])}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* --- Cards Section --- */}
            <div className="w-full max-w-6xl flex-1 overflow-y-auto no-scrollbar pb-20 pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
                {active_project.hasCalendar && (
                  <div
                    onClick={() => {
                      navigate(`/calendar/${active_project.title}`);
                    }}
                  >
                    <SpotlightCard
                      className="custom-spotlight-card h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer flex flex-col group hover:-translate-y-1 hover:border-white/20"
                      spotlightColor="rgba(0, 229, 255, 0.15)"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center">
                          <MoreHorizontal className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Card Content */}
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-200 tracking-tight">
                        CALENDAR
                      </h2>

                      {/* Card Footer */}
                      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs text-cyan-400 font-semibold tracking-wide uppercase">
                          Read more
                        </span>
                        <span className="text-cyan-400 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </div>
                    </SpotlightCard>
                  </div>
                )}
                
                {active_project?.content?.map(
                  (item: project_content, index: number) => {
                    // NEW: check if this specific item is selected
                    const isSelected = selectedContainers.includes(item.title);

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          set_active_project_content(item);
                          setContainerModalOpen(true);
                        }}
                      >
                        <SpotlightCard
                          // NEW: Change border if selected
                          className={`custom-spotlight-card h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border transition-all duration-300 cursor-pointer flex flex-col group hover:-translate-y-1 ${
                            isSelected ? "border-cyan-500 shadow-cyan-500/20 shadow-lg" : "border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-cyan-500/10"
                          }`}
                          spotlightColor="rgba(0, 229, 255, 0.15)"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-4 relative z-20">
                            {/* NEW: Checkbox to select/deselect container */}
                            <div 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents opening the container modal
                                toggleSelection(item.title);
                              }}
                              className="w-8 h-8 rounded-lg flex items-center justify-start text-gray-500 hover:text-cyan-400 transition-colors"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-cyan-400" />
                              ) : (
                                <Square className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                              )}
                            </div>

                            {/* Existing Options Menu */}
                            <div
                              className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center"
                              onClick={(e) => {
                                set_active_project_content(item);
                                setIsContainerOptionOpen(true);
                                e.stopPropagation();
                              }}
                            >
                              <MoreHorizontal className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>

                          {/* Card Content */}
                          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-200 tracking-tight">
                            {item.title}
                          </h2>
                          <p className="text-gray-400 flex-1 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                            {item.information.length > 50
                              ? `${item.information.substring(0, 100)}...`
                              : item.information}
                          </p>

                          {/* Card Footer */}
                          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs text-cyan-400 font-semibold tracking-wide uppercase">
                              Read more
                            </span>
                            <span className="text-cyan-400 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                              →
                            </span>
                          </div>
                        </SpotlightCard>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Modals remain the same */}
            {newContainerModalOpen && (
              <NewContainer
                onClose={() => {
                  handleUpdateProjects();
                  setNewContainerModalOpen(false);
                }}
                projects={all_projects}
                active_project={active_project}
              />
            )}
            {createNew && (
              <ModalCreateNew
                projects={all_projects}
                active_project={active_project}
                onClose={() => {
                  handleUpdateProjects();
                  setCreateNew(false);
                }}
              />
            )}
            {containerModalOpen && (
              <ContainerModal
                onClose={() => {
                  setContainerModalOpen(false);
                }}
                project_content={active_project_content!}
                projects={all_projects}
                active_project={active_project}
              />
            )}
            {isContainerOptionOpen && (
              <ModalContainerOptions
                onClose={() => {
                  setIsContainerOptionOpen(false);
                }}
                active_project={active_project}
                projects={all_projects}
                container={active_project_content!}
              />
            )}
          </div>
        )}
        <Chat
          projects={all_projects}
          active_project={active_project!}
          onUpdate={() => {
            handleUpdateProjects();
          }}
        />
      </div>
    </div>
  );
}