import React, { useState, useEffect } from "react";
import type { all_projects, project } from "../../types/project.types";
import { X, Type, AlignLeft, FolderPlus } from "lucide-react";

interface NewContainerProps {
  projects: all_projects;
  active_project: project;
  onClose: () => void;
}

export default function NewContainer({ projects, active_project, onClose }: NewContainerProps) {
  const [form, setForm] = useState({
    title: "",
    information: "",
  });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSave = () => {
    // Find the current active project to append data to
    // removed the previous project so i can append new data
    // content new value
    const removed_list = projects.filter(p => p.title !== active_project.title);
    console.log("removed", removed_list)    
    
    active_project.content.push(form)
    const updated_projects = [active_project,...removed_list];
    console.log("updated", updated_projects)
    localStorage.setItem("RileyProjects",JSON.stringify(updated_projects))
    // console.log("new_value", active_project)
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dimmed Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Glowing Top Edge */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-inner">
              <FolderPlus className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                New Entry
              </h2>
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Adding to <span className="text-cyan-400">{active_project?.title || "Project"}</span>
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all duration-200 group"
          >
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-500" />
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Q3 Marketing Strategy"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-200 hover:bg-white/10"
              autoFocus
            />
          </div>

          {/* Information Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-cyan-500" />
              Information
            </label>
            <textarea
              value={form.information}
              onChange={(e) => setForm({ ...form, information: e.target.value })}
              placeholder="Enter the details here..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-200 hover:bg-white/10 resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all duration-200"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSave}
            disabled={!form.title.trim()} // Disable if title is empty
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 border border-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}