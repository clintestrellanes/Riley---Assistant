// root/parent
export interface all_projects{
  projects: project[];
}

// about a specific project/ container 
export interface project {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  content: project_content[];
}

// use in sidebar
export interface project_props {
  title: string;
}

// project content
export interface project_content {
  id: number;
  title: string;
  information: string;
}
