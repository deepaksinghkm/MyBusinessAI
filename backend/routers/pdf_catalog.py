from fastapi import APIRouter

router = APIRouter(
    prefix="/pdf-catalog",
    tags=["PDF Catalog"]
)


@router.post("/generate")
def generate():

    return {
        "message": "PDF Generator Connected"
    }
