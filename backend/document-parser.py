import PyPDF2
import docx2txt
from pathlib import Path
import aiofiles
import tempfile

async def extract_text_from_resume(file) -> tuple:
    """
    Extract text from resume file and detect its format.
    
    Args:
        file: The uploaded resume file
        
    Returns:
        A tuple containing (text_content, file_format, document_structure)
    """
    temp_file = Path(tempfile.gettempdir()) / file.filename
    
    async with aiofiles.open(temp_file, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext == '.pdf':
        with open(temp_file, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        format_type = 'pdf'
    elif file_ext in ['.docx', '.doc']:
        text = docx2txt.process(temp_file)
        format_type = 'docx'
    else:  # Assume it's a text file
        async with aiofiles.open(temp_file, 'r', encoding='utf-8') as f:
            text = await f.read()
        format_type = 'txt'
    
    # Analyze the structure of the resume
    structure = analyze_resume_structure(text)
    
    return text, format_type, structure

def analyze_resume_structure(text: str) -> dict:
    """
    Analyze the structure of the resume to maintain formatting when optimizing.
    
    Args:
        text: The text content of the resume
        
    Returns:
        A dictionary mapping section names to their content
    """
    # This is a simplified implementation
    # In a real application, you would use more sophisticated parsing
    
    sections = {}
    current_section = "header"
    sections[current_section] = []
    
    lines = text.split('\n')
    
    common_section_headers = [
        "EDUCATION", "EXPERIENCE", "SKILLS", "PROJECTS", 
        "CERTIFICATIONS", "AWARDS", "PUBLICATIONS", "REFERENCES",
        "WORK EXPERIENCE", "PROFESSIONAL EXPERIENCE", "TECHNICAL SKILLS",
        "SUMMARY", "OBJECTIVE", "PROFILE"
    ]
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if this line is a section header
        is_header = False
        for header in common_section_headers:
            if header in line.upper() and len(line) < 50:  # Assume headers are short
                current_section = line
                sections[current_section] = []
                is_header = True
                break
                
        if not is_header:
            sections[current_section].append(line)
    
    return sections

