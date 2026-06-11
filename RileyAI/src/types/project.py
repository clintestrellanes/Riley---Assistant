from typing import List
from pydantic import BaseModel
# You can also import datetime if you want Pydantic to automatically parse those strings:
# from datetime import datetime

class ProjectContent(BaseModel):
    id: int
    title: str
    information: str

class ProjectProps(BaseModel):
    title: str

class Project(BaseModel):
    id: int
    title: str
    description: str
    created_at: str  
    updated_at: str 
    content: List[ProjectContent]

class AllProjects(BaseModel):
    projects: List[Project]