from dataclasses import dataclass


@dataclass(frozen=True)
class User:
    id: int
    username: str
    email: str
    password_hash: str
    created_at: str
    is_admin: int = 0
