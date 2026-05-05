from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.backend.api.routes.core import router as core_router

app = FastAPI(title='BridgeX API', version='0.1.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:1420', 'http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.include_router(core_router)
