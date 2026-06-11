import React, { useState } from "react";
import { Search, ArrowUpDown, Plus, Filter, MoreHorizontal } from "lucide-react";

// components
import Dither from "@/components/Dither";
import SpotlightCard from "@/components/SpotlightCard";

// my components
import Chat from "./project_manager/chat";
import Sidebar from "./project_manager/sidebar";
import ContainerModal from "./project_manager/modal_container";
import NewContainer from "./project_manager/modal_new_container";


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
  const [containerModalOpen, setContainerModalOpen] = useState<boolean>(false);
  const [newContainerModalOpen, setNewContainerModalOpen] = useState<boolean>(false);


  // specific content inside a project
  const [active_project_content, set_active_project_content] = useState<project_content | null>(null);


  const handleUpdateProjects = () => {
    const savedProjects = JSON.parse(localStorage.getItem("RileyProjects") || "[]");
    if (savedProjects) {
      console.log('updated successfully')
      set_all_projects(savedProjects)      
      set_active_project(savedProjects[0])
    }
  }

 


  
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-950">
      {/* Base dark background added to ensure contrast if Dither is transparent */}
      
      {/* Layer 1 (bottom): Dither with animation */}
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

      {/* Layer 2 (middle): Deep overlay for text legibility */}
      <div className="absolute inset-0 z-0 bg-gray-900/60 backdrop-blur-sm"></div>

      {/* Layer 3 (top): Main UI */}
      <div className="relative z-10 flex flex-row h-full w-full">
        <Sidebar
          projects={all_projects}
          active_project={active_project!}
          set_active_project={(project) => {
            set_active_project(project);
          }}
          onUpdate={() => {
            handleUpdateProjects()
          }}
        />
        {!active_project ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 h-full overflow-hidden">
            {/* Subtle Empty State Icon */}
            <div className="w-20 h-20 mb-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-500 hover:bg-white/[0.04]">
              <div className="w-8 h-8 border-[1.5px] border-gray-600/60 rounded-lg border-dashed flex items-center justify-center">
                <div className="w-3 h-[1.5px] bg-gray-600/60 rounded-full" />
              </div>
            </div>
            
            {/* Lighter Typography */}
            <h1 className="text-2xl font-medium text-gray-300 tracking-wide mb-3">
              No Active Project
            </h1>
            <p className="text-gray-500 font-light text-center max-w-sm leading-relaxed">
              Select an existing project from the sidebar or create a new one to begin your work.
            </p>
          </div>
        ):(
        <div className="flex-1 flex flex-col items-center p-6 sm:p-10 pb-32 h-full overflow-hidden">
          {/* --- Search & Sort Section --- */}
          <div className="w-full max-w-6xl flex flex-wrap sm:flex-nowrap items-center gap-3 mb-8">
            {/* Search Input */}
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

            {/* Sort Button */}
            <button className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 group">
              <ArrowUpDown className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
            </button>

            {/* Filter Button */}
            <button className="p-3 rounded-2xl bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/20 shadow-lg hover:bg-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 group">
              <Filter className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </button>

            {/* New container Button */}
            <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 group flex items-center gap-2 border border-white/10"
              onClick={() => {
                setNewContainerModalOpen(true)
              }}
            >
              <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-white font-medium tracking-wide hidden sm:inline">
                New Container
              </span>
            </button>
          </div>

          {/* --- Cards Section --- */}
          <div className="w-full max-w-6xl flex-1 overflow-y-auto no-scrollbar pb-20 pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
              {active_project?.content?.map(
                (item: project_content, index: number) => {
                  return (
                    <div onClick={() => {
                      set_active_project_content(item)
                      setContainerModalOpen(true)
                    }}>
                    <SpotlightCard
                      key={index}
                      className="custom-spotlight-card h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer flex flex-col group hover:-translate-y-1 hover:border-white/20"
                      spotlightColor="rgba(0, 229, 255, 0.15)"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                        </div>
                        <div className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center">
                          <MoreHorizontal className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-200 tracking-tight">
                        {item.title}
                      </h2>
                      <p className="text-gray-400 flex-1 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                        {item.information}
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
                }
              )}
            </div>
          </div>
          {containerModalOpen && (
            <ContainerModal
              // project={active_project_content}
              projects={all_projects}
              active_project={active_project}
              project_content={active_project_content}
              onClose={() => {
                handleUpdateProjects()
                setContainerModalOpen(false)
              }}
            />
          )}
          {newContainerModalOpen && (
            <NewContainer onClose={() => {
              handleUpdateProjects()
              setNewContainerModalOpen(false)
            }}
            projects={all_projects}
            active_project={active_project}
            />
          )}
          <Chat />
        </div>)};
      </div>
    </div>
  );
}