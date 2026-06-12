 # this will create and manage projects base on the given context
from src.types.project import Project
from pydantic import BaseModel


class GodFatherProps(BaseModel): 
  instructions: str
  active_project: Project


def GodFather(data: GodFatherProps):
    print(data)