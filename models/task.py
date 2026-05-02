from dataclasses import dataclass


@dataclass(frozen=True)
class Task:
    id: int
    user_id: int
    title: str
    description: str
    is_done: int
    created_at: str
