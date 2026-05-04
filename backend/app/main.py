from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.scan import router as scan_router
from app.routes.organize import router as organize_router
from app.routes.ai import router as ai_router
from app.routes.stats import router as stats_router

app = FastAPI(title="Smart File Organizer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router)
app.include_router(organize_router)
app.include_router(ai_router)
app.include_router(stats_router)
