from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import Base, engine
from app import models
from app.routes import auth, books

app = FastAPI(
    title="Margin — your reading catalogue",
    description="A private place to keep the books you read and the thoughts you leave behind.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in settings.frontend_origins.split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(books.router)


@app.get("/api/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
