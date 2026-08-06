from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid

router = APIRouter(
    prefix="/product-images",
    tags=["Product Images"]
)

MAX_SIZE = 150 * 1024

ALLOWED = [
    "image/jpeg",
    "image/jpg",
    "image/png"
]


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    if file.content_type not in ALLOWED:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG and PNG allowed."
        )

    contents = await file.read()

    if len(contents) > MAX_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Image must be under 150 KB."
        )

    ext = os.path.splitext(file.filename)[1]

    filename = f"{uuid.uuid4()}{ext}"

    path = os.path.join(
        "uploads/products",
        filename
    )

    with open(path, "wb") as f:
        f.write(contents)

    return {
        "filename": filename,
        "path": f"/uploads/products/{filename}"
    }
