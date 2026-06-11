import React, { useEffect, useState } from 'react';
import type { project_content, all_projects, project } from '../../types/project.types';
import { X, Trash2 } from 'lucide-react';

interface ContainerModalProps {
  projects: all_projects;
  active_project: project;
  project_content: project_content;
  onClose: () => void;
}

export default function ContainerModal({ project_content, onClose, projects, active_project }: ContainerModalProps) {
  // Local state for editing
  const [title, setTitle] = useState(project_content.title || '');
  const [information, setInformation] = useState(project_content.information || '');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleUpdate = () => {
    // 1. Create the updated content object
    const updatedContentItem = {
      ...project_content,
      title,
      information
    };

    // 2. Check if this content already exists in the active project to update it, or append if new
    const contentArray = active_project.content || [];
    const contentExists = contentArray.some((c) => c.title === project_content.title);

    let newContentArray;
    if (contentExists) {
      newContentArray = contentArray.map((c) =>
        c.title === project_content.title ? updatedContentItem : c
      );
    } else {
      newContentArray = [...contentArray, updatedContentItem];
    }

    const updatedActiveProject = {
      ...active_project,
      content: newContentArray
    };

    // 3. Update the global projects array
    const filteredProjects = projects.filter((p) => p.title !== active_project.title);
    const newProjects = [updatedActiveProject, ...filteredProjects];

    // 4. Save and close
    localStorage.setItem("RileyProjects", JSON.stringify(newProjects));
    onClose();
  };

  const handleDelete = () => {
    // 1. Filter out the current project_content using the original title
    const updatedContent = (active_project.content || []).filter(
      (content) => content.title !== project_content.title
    );

    const updatedActiveProject = {
      ...active_project,
      content: updatedContent
    };
    
    // 2. Update the global projects array
    const filteredProjects = projects.filter((p) => p.title !== active_project.title);
    const newProjects = [updatedActiveProject, ...filteredProjects];

    // 3. Save and close
    localStorage.setItem("RileyProjects", JSON.stringify(newProjects));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Soft Light Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Minimal White Modal Container */}
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 mr-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
              <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                Edit Project
              </span>
            </div>
            {/* Editable Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Title"
              className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
            />
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar">
          {/* Editable Information */}
          <textarea
            value={information}
            onChange={(e) => setInformation(e.target.value)}
            placeholder="Add a description for this project..."
            className="w-full min-h-[200px] resize-y text-gray-600 leading-relaxed text-[15px] placeholder-gray-300 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
          
          {/* Delete Action */}
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
          
          {/* Main Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium border border-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button 
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium shadow-sm transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}