from pydantic import BaseModel, Field


class FolderRequest(BaseModel):
    folder_path: str = Field(..., min_length=1)
    ai_assisted: bool = False
