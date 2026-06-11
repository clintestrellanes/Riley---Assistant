import React, { useState, useRef, useEffect } from "react";
import type { project, all_projects } from "../../types/project.types";
import { ChevronRight, ChevronLeft, Plus, Trash2 } from "lucide-react";

interface SidebarProps {
  projects: all_projects;
  active_project: project;
  set_active_project: (project: project) => void;
  onUpdate: () => void;
}

export default function Sidebar({ projects, active_project, set_active_project, onUpdate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  
  // States for inline renaming existing projects
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  // States for creating a new project
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const newProjectInputRef = useRef<HTMLInputElement>(null);

  // Focus rename input
  useEffect(() => {
    if (editingTitle && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingTitle]);

  // Focus new project input
  useEffect(() => {
    if (isCreating && newProjectInputRef.current) {
      newProjectInputRef.current.focus();
    }
  }, [isCreating]);

  // Helper to accurately reflect the active project based on its title
  const isActive = (proj: project) => active_project?.title === proj.title;

  const handleDelete = (e: React.MouseEvent, proj: project) => {
    e.stopPropagation(); 
    const new_list = projects.filter((p) => p.title !== proj.title);
    
    localStorage.setItem("RileyProjects", JSON.stringify(new_list));
    onUpdate();
    
    if (isActive(proj)) {
      set_active_project(new_list[0] || null);
    }
  };

  const startEditing = (title: string) => {
    setEditingTitle(title);
    setEditValue(title);
  };

  const submitRename = (oldTitle: string) => {
    const newTitle = editValue.trim();

    if (!newTitle || newTitle === oldTitle) {
      setEditingTitle(null);
      return;
    }

    if (projects.some((p) => p.title.toLowerCase() === newTitle.toLowerCase() && p.title !== oldTitle)) {
      alert("A project with this name already exists.");
      return; 
    }

    const updatedProjects = projects.map((p) => 
      p.title === oldTitle ? { ...p, title: newTitle, updated_at: new Date().toISOString() } : p
    );

    localStorage.setItem("RileyProjects", JSON.stringify(updatedProjects));
    onUpdate();
    
    if (active_project?.title === oldTitle) {
      const updatedActive = updatedProjects.find((p) => p.title === newTitle);
      if (updatedActive) set_active_project(updatedActive);
    }

    setEditingTitle(null);
  };

  const submitNewProject = () => {
    const trimmedTitle = newProjectTitle.trim();

    // If empty, just cancel creation
    if (!trimmedTitle) {
      setIsCreating(false);
      setNewProjectTitle("");
      return;
    }

    // Check for duplicates
    if (projects.some((p) => p.title.toLowerCase() === trimmedTitle.toLowerCase())) {
      alert("A project with this name already exists. Please choose a different name.");
      return; // Keep input open so they can change it
    }

    const newProject: project = {
      title: trimmedTitle,
      description: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: [],
    };
    
    const updatedProjects = [...projects, newProject];
    
    localStorage.setItem("RileyProjects", JSON.stringify(updatedProjects));
    onUpdate();
    set_active_project(newProject);
    
    // Reset and close input
    setIsCreating(false);
    setNewProjectTitle("");
  };

  return (
    <aside
      className={`relative h-screen flex-shrink-0 transition-all duration-300 ease-in-out z-20 ${
        isOpen ? "w-72" : "w-0"
      }`}
    >
      <div
        className={`absolute top-0 left-0 h-full bg-white border-r border-gray-100 shadow-sm flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full"
        }`}
      >
        <div className="w-72 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-6 border-b border-gray-100 bg-white">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Projects
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              {projects.length}
            </span>
          </div>

          {/* Projects List */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 bg-gray-50/50">
            {projects.map((proj: project, idx: number) => {
              const active = isActive(proj);
              const isEditing = editingTitle === proj.title;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredProject(idx)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => {
                    if (!isEditing) set_active_project(proj);
                  }}
                  onDoubleClick={() => startEditing(proj.title)}
                  className={`group relative flex items-center justify-between pl-3 pr-2 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                    active
                      ? "bg-white shadow-sm border border-gray-200"
                      : "hover:bg-white/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full truncate">
                    {/* Project Icon / Status Indicator */}
                    <div className="relative flex-shrink-0 flex items-center justify-center w-5 h-5">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          active
                            ? "bg-gray-900 scale-125"
                            : hoveredProject === idx
                            ? "bg-gray-400"
                            : "bg-gray-300"
                        }`}
                      />
                    </div>

                    {/* Project Info / Editor */}
                    <div className="truncate flex-1">
                      {isEditing ? (
                        <input
                          ref={renameInputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => submitRename(proj.title)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitRename(proj.title);
                            if (e.key === 'Escape') setEditingTitle(null);
                          }}
                          className="w-full text-sm font-medium text-gray-900 bg-gray-100/80 border border-gray-200 rounded px-1.5 py-0.5 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                        />
                      ) : (
                        <h3
                          className={`text-sm font-medium transition-colors duration-200 truncate select-none ${
                            active
                              ? "text-gray-900"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}
                        >
                          {proj.title}
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Actions Container (Delete & Arrow) - Hidden while editing */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => handleDelete(e, proj)}
                        className={`p-1.5 rounded-md transition-all duration-200 ${
                          active 
                            ? "opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50" 
                            : "opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 hover:bg-red-50"
                        }`}
                        aria-label="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <ChevronRight
                        className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
                          active
                            ? "opacity-100 text-gray-900"
                            : hoveredProject === idx
                            ? "opacity-100 translate-x-0 text-gray-400"
                            : "opacity-0 -translate-x-2 text-gray-300"
                        }`}
                      />
                    </div>
                  )}

                  {/* Active Edge Indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gray-900 rounded-r-full" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer / Create New Project Input OR Button */}
          <div className="p-4 border-t border-gray-100 bg-white">
            {isCreating ? (
              <div className="flex items-center gap-2 py-2 px-3 rounded-xl border border-gray-300 bg-gray-50 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                <input
                  ref={newProjectInputRef}
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  onBlur={submitNewProject}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitNewProject();
                    if (e.key === 'Escape') {
                      setIsCreating(false);
                      setNewProjectTitle("");
                    }
                  }}
                  placeholder="Project Name..."
                  className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none placeholder-gray-400"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-8 -right-3.5 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <ChevronLeft
          className={`h-4 w-4 transition-transform duration-300 ${
            !isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </aside>
  );
}