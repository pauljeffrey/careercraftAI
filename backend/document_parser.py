import PyPDF2
import docx2txt
from pathlib import Path
import aiofiles
import tempfile
from pypdf import PdfReader
from typing import List, Tuple
from fastapi import UploadFile

async def extract_text_and_images_from_resume(file: UploadFile) -> Tuple[str, str, List[bytes]]:
    """
    Extract text and embedded images (for PDFs) from a resume file and detect its format.

    Args:
        file: The uploaded resume file (UploadFile)

    Returns:
        A tuple containing:
            - text_content: str
            - file_format: str ('pdf', 'docx', 'txt')
            - images: List[bytes] (empty for non-PDFs)
    """
    temp_file = Path(tempfile.gettempdir()) / file.filename

    # Save file temporarily
    async with aiofiles.open(temp_file, 'wb') as f:
        content = await file.read()
        await f.write(content)

    file_ext = temp_file.suffix.lower()
    images = []
    text = ""
    format_type = ""

    if file_ext == '.pdf':
        format_type = 'pdf'
        with open(temp_file, "rb") as f:
            reader = PdfReader(f)
            for page in reader.pages:
                # Extract embedded images
                if "/XObject" in page.get("/Resources", {}):
                    xObject = page["/Resources"]["/XObject"].get_object()
                    for obj in xObject:
                        if xObject[obj].get("/Subtype") == "/Image":
                            image_data = xObject[obj]._data
                            images.append(image_data)
                text += page.extract_text() or ""

    elif file_ext in ['.docx', '.doc']:
        format_type = 'docx'
        text = docx2txt.process(temp_file)

    else:
        format_type = 'txt'
        async with aiofiles.open(temp_file, 'r', encoding='utf-8') as f:
            text = await f.read()

    return text, format_type, images