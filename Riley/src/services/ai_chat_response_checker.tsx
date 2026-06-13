export default function AI_Chat_Response_Checker(object_from_backend: any) {
  // Safely drill down to see if the AI generated project data
  if (object_from_backend?.response?.project_data) {
    return "new_project";
  } else if (object_from_backend?.response?.container_data) {
    return "new_container"
  }
  return "text_only";
}