from typing import List, Optional
from pydantic import BaseModel
from src.types.calendar import DateCell
# You can also import datetime if you want Pydantic to automatically parse those strings:
# from datetime import datetime

class ProjectContent(BaseModel):
    id: Optional[int] = None
    title: str
    information: str

class ProjectProps(BaseModel):
    title: str

class Project(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    created_at: str  
    updated_at: str 
    content: List[ProjectContent]
    hasCalendar: bool
    events: Optional[List[DateCell]]

