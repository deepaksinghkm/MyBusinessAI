from pydantic import BaseModel


class RoleCreate(BaseModel):
    name: str
    description: str


class RoleResponse(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        from_attributes = True
