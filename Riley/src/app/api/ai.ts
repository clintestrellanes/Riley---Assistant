import type { all_projects, project } from "../../types/project.types";

export default async function AiChat(
  user_query: string,
  projects: all_projects,
  active_prj: project,
) {
  console.log("the projects are -> ", projects)
  console.log("the active prj is -> ", active_prj)
  try {
  
    const ai = await fetch("http://localhost:8000/think", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: user_query,
        all_user_projects: projects,
        active_project: active_prj
      }),
    });
  
    const response = await ai.json();
    // recieve anything from the backend
    return response;
  } catch (e) {
    console.error("FastAPI Validation Error:", JSON.stringify(e, null, 2));
    return "may sayop na resposne diri dappit sa ai.ts";
  }
  
}
