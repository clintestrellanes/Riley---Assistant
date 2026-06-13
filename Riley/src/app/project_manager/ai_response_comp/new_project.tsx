import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react'; // Assuming you are still using lucide-react
import type { project } from '../../../types/project.types';

interface Props {
  proj: project;
  onUpdate?: () => void; // Made optional just in case it isn't passed
}

export default function AINewProjectChat({ proj, onUpdate }: Props) {
  // Add state to prevent duplicate saves and give user feedback
  const [isSaved, setIsSaved] = useState(false);

  if (!proj) return null;

  const handle_approve_project = () => {
    try {
      // 1. Generate unique IDs since the AI correctly returns null for new projects
      const newId = Date.now();
      
      const new_project: project = {
        ...proj,
        id: newId,
        // Also assign unique IDs to the nested content blocks
        content: proj.content?.map((item, index) => ({
          ...item,
          id: newId + index + 1
        })) || []
      };

      // 2. Safely fetch existing projects (fallback to [] if empty)
      const storedData = localStorage.getItem("RileyProjects");
      const old_projects: project[] = storedData ? JSON.parse(storedData) : [];

      // 3. Prepend the new project and save
      const updated_projects = [new_project, ...old_projects];
      localStorage.setItem("RileyProjects", JSON.stringify(updated_projects));

      // 4. Update UI and notify the parent component to refresh the sidebar
      setIsSaved(true);
      if (onUpdate) onUpdate();

    } catch (error) {
      console.error("Failed to save project to localStorage:", error);
    }
  };

  return (
    <div className="mt-3 bg-white/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-md font-bold text-gray-800">{proj.title}</h4>
      </div>
      
      {proj.description && (
        <p className="text-sm text-gray-600 mb-4">{proj.description}</p>
      )}
      
      <div className="space-y-3 mb-4">
        {proj.content?.map((item, idx) => (
          <div key={idx} className="bg-white/50 rounded-lg p-3 border border-white/40">
            <h5 className="text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-1">
              {item.title}
            </h5>
            <p className="text-sm text-gray-700">{item.information}</p>
          </div>
        ))}
      </div>

      {/* Action Button Using Standard Utility Classes */}
      <button
        onClick={handle_approve_project}
        disabled={isSaved}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isSaved 
            ? "bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
            : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-sm"
        }`}
      >
        {isSaved ? (
          <>
            <Check className="w-4 h-4" />
            Project Saved
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Approve & Save Project
          </>
        )}
      </button>
    </div>
  );
}