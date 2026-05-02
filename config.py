import os


class Config:
    """Central application configuration.

    Development defaults are provided so the project can run immediately.
    In a real deployment, secrets must be supplied through environment variables.
    """

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    JWT_SECRET = os.getenv("JWT_SECRET", "dev-jwt-secret-change-me")
    JWT_EXPIRES_MINUTES = int(os.getenv("JWT_EXPIRES_MINUTES", "30"))
    DATABASE_PATH = os.getenv("DATABASE_PATH", "database/app.db")
