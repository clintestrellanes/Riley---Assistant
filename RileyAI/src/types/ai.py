from pydantic import BaseModel
from typing import List, Literal

# ======= PROJECT TYPES ======= # 
from src.types.project import Project 
# ======= PROJECT TYPES ======= #  

# Raw Chat completion: {
#   "message": "To create the Toothalie project, I will invoke the create_project tool with the provided details. The project name is Toothalie, and it will use React as the frontend and Symfony as the backend frameworks. The initial database schema includes tables for users, appointments, and dentist_available_schedules.",
#    "tools": [
#      {
#        "id": "step_1",
#        "tool_name": "create_project",
#        "depends_on": [],
#        "status": "pending"
#      }
#    ]
# }

class Tool(BaseModel):
    id: str
    tool_name:str
    depends_on:List[str]
    status: Literal["completed","failed","pending"]


    
class Tools(BaseModel):
    message: str
    tools: List[Tool]
    


    # {
    #   "message": "[A brief message explaining the action taken to the user]",
    #   "status": "[Must be exactly 'completed' if successful, or 'failed' if the request cannot be processed]",
    #   "project_data": {
    #     "id": null,
    #     "title": "[Extracted or generated project title]",
    #     "description": "[A professional, 1-2 sentence summary of the project goals]",
    #     "created_at": "[Current ISO 8601 Timestamp]",
    #     "updated_at": "[Current ISO 8601 Timestamp]",
    #     "content": [
    #       {
    #         "id": null,
    #         "title": "[Category Title]",
    #         "information": "[Detailed information]"
    #       }
    #     ]
    #   }
    # }
class Create_Project_AI_Response (BaseModel):
    message: str
    status: Literal["completed","failed"]
    project_data: Project