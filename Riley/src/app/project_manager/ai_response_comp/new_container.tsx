import React, { useState, useCallback } from 'react';
import { Plus, Check, LayoutPanelLeft } from 'lucide-react';
import type { project_content, project } from '../../../types/project.types';

interface NewContainerProps {
  onUpdate: () => void;
  project_cont: project_content[];
  active_project: project;
}

// Moved outside to avoid useCallback
const generateUniqueId = () => Date.now() + Math.floor(Math.random() * 1000);

export default function AINewContainerChat({ onUpdate, project_cont, active_project }: NewContainerProps) {
  const [approvedItems, setApprovedItems] = useState<Set<number>>(new Set());

  const handleApprove = useCallback(
    (content: project_content) => {
      try {
        const storedData = localStorage.getItem("RileyProjects");
        const all_proj: project[] = storedData ? JSON.parse(storedData) : [];

        const projectIndex = all_proj.findIndex((p) => p.title === active_project.title);

        if (projectIndex !== -1) {
          const new_content: project_content = {
            ...content,
            id: generateUniqueId(),
          };

          const existingContent = all_proj[projectIndex].content || [];
          all_proj[projectIndex].content = [new_content, ...existingContent];

          localStorage.setItem("RileyProjects", JSON.stringify(all_proj));

          setApprovedItems((prev) => new Set(prev).add(content.id));

          if (onUpdate) onUpdate();
        } else {
          console.error("Active project not found in localStorage.");
        }
      } catch (error) {
        console.error("Failed to save container to localStorage:", error);
      }
    },
    [active_project.title, onUpdate]
  );

  // Early return after all hooks have been called
  if (!project_cont || project_cont.length === 0) return null;

  return (
    <div className="mt-3 w-full flex flex-col gap-3">
      {project_cont.map((container, idx) => {
        const isApproved = approvedItems.has(container.id);

        return (
          <div
            key={idx}
            className="bg-white/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 shadow-sm w-full transition-all duration-200 hover:bg-white/80"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <LayoutPanelLeft className="w-4 h-4 text-cyan-600" />
                  <h5 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    {container.title}
                  </h5>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {container.information}
                </p>
              </div>

              <button
                onClick={() => handleApprove(container)}
                disabled={isApproved}
                className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isApproved
                    ? "bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-sm"
                }`}
              >
                {isApproved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Add to Project
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}