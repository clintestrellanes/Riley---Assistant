from typing import List, Optional, Literal
from datetime import date, datetime, time
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class BaseCamelModel(BaseModel):
    """
    Base model config that automatically aliases snake_case fields 
    to camelCase to perfectly match the TypeScript frontend.
    """
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class EventPermissions(BaseCamelModel):
    modify: bool
    invite_others: bool
    see_guest_list: bool

# ViewMode translates perfectly to a Python Literal
ViewMode = Literal['month', 'week', 'day', 'list']

class CalendarEvent(BaseCamelModel):
    id: str
    title: str
    description: str
    start_date: date  # Pydantic natively parses 'YYYY-MM-DD' strings
    end_date: date    
    all_day: bool
    start_time: Optional[time] = None  # Pydantic natively parses 'HH:MM' strings
    end_time: Optional[time] = None   
    location: Optional[str] = None
    guests: List[str]
    color: str  # e.g., 'purple', 'indigo', 'blue', etc.
    permissions: EventPermissions

class DateCell(BaseCamelModel):
    date: datetime  # JS 'Date' translates best to Python 'datetime'
    is_current_month: bool
    is_today: bool
    events: List[CalendarEvent]