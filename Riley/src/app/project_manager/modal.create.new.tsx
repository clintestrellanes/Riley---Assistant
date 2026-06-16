import React, { useState } from "react";
import { FolderPlus, CalendarPlus, X } from "lucide-react";

// components
import NewContainer from "./modal_new_container";
import type { all_projects, project } from "../../types/project.types";

interface ModalCreateNewProps {
  projects: all_projects;
  active_project: project;
  onClose: () => void;
  // Optional: add an onUpdate callback if your parent component needs to know about the new data
  // onUpdate?: (updatedProjects: all_projects) => void; 
}

export default function ModalCreateNew({
  onClose,
  projects,
  active_project,
}: ModalCreateNewProps) {
  const [activeModal, setActiveModal] = useState<"container" | "calendar" | null>(null);

  const handleCreateCalendar = () => {
    if (!active_project.hasCalendar) {
      console.log("cal status",active_project.hasCalendar)
      const new_active_project = { 
        ...active_project, 
        hasCalendar: true, 
        events: [] 
      };
      
      const remaining_projects = projects.filter((p) => p.title !== active_project.title);
      const updated_projects = [new_active_project, ...remaining_projects];
      
      localStorage.setItem("RileyProjects", JSON.stringify(updated_projects));
      
     
    }

    onClose();
  };

  if (activeModal === "container") {
    return (
      <NewContainer
        projects={projects}
        active_project={active_project}
        onClose={onClose} 
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Create New...</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          {/* Container Button */}
          <button
            onClick={() => setActiveModal("container")}
            className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-gray-100 bg-gray-50 p-6 transition-all hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
          >
            <div className="rounded-full bg-blue-100 p-3 text-blue-600 transition-transform group-hover:scale-110">
              <FolderPlus size={28} strokeWidth={1.5} />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-blue-700">
              Container
            </span>
          </button>

          {/* Calendar Button */}
          <button
            onClick={handleCreateCalendar}
            className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-gray-100 bg-gray-50 p-6 transition-all hover:border-purple-500 hover:bg-purple-50 hover:shadow-md"
          >
            <div className="rounded-full bg-purple-100 p-3 text-purple-600 transition-transform group-hover:scale-110">
              <CalendarPlus size={28} strokeWidth={1.5} />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-purple-700">
              Calendar
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}