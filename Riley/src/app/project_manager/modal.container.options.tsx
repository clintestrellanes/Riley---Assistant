import React from "react";
import { Trash2, X, Edit2 } from "lucide-react"; // Requires: npm install lucide-react

import type {
  project,
  all_projects,
  project_content,
} from "../../types/project.types";

interface MoreContainerOptionsProps {
  onClose: () => void;
  active_project: project;
  projects: all_projects;
  container: project_content;
  onUpdate: () => void;
}

export default function ModalContainerOptions({
  onClose,
  active_project,
  projects,
  container,
  onUpdate,
}: MoreContainerOptionsProps) {
  
  const handleDeleteContainer = () => {
    // 1. Remove the specific container from the active project's content
    const updated_content = active_project.content.filter(
      (c) => c.title !== container.title // Note: If your containers have 'id's, use c.id !== container.id instead!
    );

    // 2. Update the active project with the new content array
    const updated_active_project = {
      ...active_project,
      content: updated_content,
    };

    // 3. Filter out the old version of the active project from the main list
    const other_projects = projects.filter(
      (p) => p.title !== active_project.title
    );

    // 4. Combine the updated active project with the rest of the list
    const final_projects_list = [updated_active_project, ...other_projects];

    // 5. Save to local storage and close
    localStorage.setItem("RileyProjects", JSON.stringify(final_projects_list));
    onUpdate()
    onClose();
  };

  return (
    // Backdrop: captures clicks outside the modal to let the user cancel easily
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm sm:items-start sm:pt-32"
      onClick={onClose}
    >
      {/* Modal content: click.stopPropagation prevents closing when clicking inside the menu */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-xs overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
          <h3 className="truncate font-medium text-gray-700">
            {container.title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Action List */}
        <div className="flex flex-col p-2">

          {/* Delete Button */}
          <button
            onClick={handleDeleteContainer}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={16} className="text-red-500" />
            Delete Container
          </button>
          
        </div>
      </div>
    </div>
  );
}