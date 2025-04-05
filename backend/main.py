from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel, Field
from pydantic_ai import AI
from typing import List, Optional, Dict, Any
import asyncio
import json
import os
import tempfile
from pathlib import Path
import PyPDF2
import docx2txt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
import aiofiles
import httpx
import io

app = FastAPI(title="CareerCraft AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store the latest results for PDF generation
latest_resume_content = ""
latest_cover_letter = ""
original_resume_format = {}  # Store the structure of the original resume

# Pydantic models for structured output
class InterviewQuestion(BaseModel):
    question: str
    suggestedAnswer: str

class SimilarJob(BaseModel):
    title: str
    company: str
    url: str

class ResumeReasoning(BaseModel):
    strengths: List[str]
    weaknesses: List[str]

class JobApplicationResult(BaseModel):
    optimizedResume: Optional[str] = None
    reasoning: Optional[ResumeReasoning] = None
    coverLetter: Optional[str] = None
    missingSkills: Optional[List[str]] = None
    interviewQuestions: Optional[List[InterviewQuestion]] = None
    similarJobs: Optional[List[SimilarJob]] = None

# Pydantic AI model for resume optimization
class ResumeOptimizer(AI):
    """
    Analyze a resume and job description to provide optimized application materials.
    """
    
    def analyze_resume_for_job(
        self, 
        resume_text: str, 
        job_description: str, 
        additional_info: Optional[str] = None
    ) -> ResumeReasoning:
        """
        Analyze the resume against the job description to identify strengths and weaknesses.
        
        Args:
            resume_text: The text content of the resume
            job_description: The job description text
            additional_info: Any additional information provided by the user
            
        Returns:
            A ResumeReasoning object with strengths and weaknesses
        """
        pass
    
    def optimize_resume(
        self, 
        resume_text: str, 
        job_description: str, 
        additional_info: Optional[str] = None
    ) -> str:
        """
        Optimize the resume to better match the job description.
        
        Args:
            resume_text: The text content of the resume
            job_description: The job description text
            additional_info: Any additional information provided by the user
            
        Returns:
            The optimized resume text
        """
        pass
    
    def generate_cover_letter(
        self, 
        resume_text: str, 
        job_description: str, 
        additional_info: Optional[str] = None
    ) -> str:
        """
        Generate a personalized cover letter based on the resume and job description.
        
        Args:
            resume_text: The text content of the resume
            job_description: The job description text
            additional_info: Any additional information provided by the user
            
        Returns:
            A personalized cover letter
        """
        pass
    
    def identify_missing_skills(
        self, 
        resume_text: str, 
        job_description: str
    ) -> List[str]:
        """
        Identify skills mentioned in the job description that are missing from the resume.
        
        Args:
            resume_text: The text content of the resume
            job_description: The job description text
            
        Returns:
            A list of missing skills
        """
        pass
    
    def generate_interview_questions(
        self, 
        resume_text: str, 
        job_description: str
    ) -> List[InterviewQuestion]:
        """
        Generate potential interview questions and suggested answers based on the resume and job description.
        
        Args:
            resume_text: The text content of the resume
            job_description: The job description text
            
        Returns:
            A list of interview questions with suggested answers
        """
        pass
    
    def find_similar_jobs(
        self, 
        resume_text: str, 
        job_description: str
    ) -> List[SimilarJob]:
        """
        Find similar job opportunities based on the resume and job description.
        
        Args:
            resume_text: The text content of the resume
            job_description: The job description text
            
        Returns:
            A list of similar job opportunities
        """
        # In a real implementation, this would search job boards or use an API
        # For now, we'll return mock data
        return [
            SimilarJob(
                title="Senior Software Engineer",
                company="Tech Innovations Inc.",
                url="https://example.com/job1"
            ),
            SimilarJob(
                title="Full Stack Developer",
                company="Digital Solutions",
                url="https://example.com/job2"
            ),
            SimilarJob(
                title="Frontend Engineer",
                company="Web Experts",
                url="https://example.com/job3"
            )
        ]

# Initialize the AI model
resume_optimizer = ResumeOptimizer()

# Helper functions
async def extract_text_from_resume(file: UploadFile) -> tuple:
    """Extract text from resume file and detect its format"""
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
    """Analyze the structure of the resume to maintain formatting when optimizing"""
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

async def generate_pdf(content: str, file_type: str) -> str:
    """Generate a PDF file from the content"""
    temp_dir = tempfile.gettempdir()
    output_path = os.path.join(temp_dir, f"{file_type}.pdf")
    
    # Create a PDF document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Define styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='Normal_Justified',
        parent=styles['Normal'],
        alignment=4,  # 4 is for justified
        spaceBefore=6,
        spaceAfter=6
    ))
    
    # Create the content
    story = []
    
    # Split the content into paragraphs
    paragraphs = content.split('\n\n')
    for para in paragraphs:
        if para.strip():
            p = Paragraph(para.replace('\n', '<br/>'), styles['Normal_Justified'])
            story.append(p)
            story.append(Spacer(1, 0.2 * inch))
    
    # Build the PDF
    doc.build(story)
    
    return output_path

async def process_resume_stream(
    resume_text: str,
    job_description: str,
    additional_info: str,
    language: str
):
    """Process the resume and yield results as they become available"""
    global latest_resume_content, latest_cover_letter
    
    # First, analyze the resume for strengths and weaknesses
    reasoning = await resume_optimizer.analyze_resume_for_job(
        resume_text=resume_text,
        job_description=job_description,
        additional_info=additional_info
    )
    
    yield json.dumps({"reasoning": reasoning.model_dump()}) + "\n"
    
    # Start optimizing the resume
    optimized_resume_task = asyncio.create_task(
        resume_optimizer.optimize_resume(
            resume_text=resume_text,
            job_description=job_description,
            additional_info=additional_info
        )
    )
    
    # Start generating the cover letter
    cover_letter_task = asyncio.create_task(
        resume_optimizer.generate_cover_letter(
            resume_text=resume_text,
            job_description=job_description,
            additional_info=additional_info
        )
    )
    
    # Start identifying missing skills
    missing_skills_task = asyncio.create_task(
        resume_optimizer.identify_missing_skills(
            resume_text=resume_text,
            job_description=job_description
        )
    )
    
    # Start generating interview questions
    interview_questions_task = asyncio.create_task(
        resume_optimizer.generate_interview_questions(
            resume_text=resume_text,
            job_description=job_description
        )
    )
    
    # Start finding similar jobs
    similar_jobs_task = asyncio.create_task(
        resume_optimizer.find_similar_jobs(
            resume_text=resume_text,
            job_description=job_description
        )
    )
    
    # Wait for and yield results as they become available
    optimized_resume = await optimized_resume_task
    latest_resume_content = optimized_resume
    yield json.dumps({"optimizedResume": optimized_resume}) + "\n"
    
    cover_letter = await cover_letter_task
    latest_cover_letter = cover_letter
    yield json.dumps({"coverLetter": cover_letter}) + "\n"
    
    missing_skills = await missing_skills_task
    yield json.dumps({"missingSkills": missing_skills}) + "\n"
    
    interview_questions = await interview_questions_task
    yield json.dumps({"interviewQuestions": [q.model_dump() for q in interview_questions]}) + "\n"
    
    similar_jobs = await similar_jobs_task
    yield json.dumps({"similarJobs": [j.model_dump() for j in similar_jobs]}) + "\n"

@app.post("/api/optimize")
async def optimize_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    additional_info: str = Form(""),
    language: str = Form("english")
):
    """
    Process the resume and job description to generate optimized application materials.
    Returns a streaming response with results as they become available.
    """
    # Extract text from the resume
    resume_text, format_type, structure = await extract_text_from_resume(resume)
    
    # Store the original resume format for later use
    global original_resume_format
    original_resume_format = {
        "format_type": format_type,
        "structure": structure
    }
    
    # Create a streaming response
    return StreamingResponse(
        process_resume_stream(resume_text, job_description, additional_info, language),
        media_type="application/json"
    )

@app.get("/api/download/{file_type}")
async def download_file(file_type: str, background_tasks: BackgroundTasks):
    """
    Download the optimized resume or cover letter as a PDF.
    """
    global latest_resume_content, latest_cover_letter
    
    if file_type == "resume" and latest_resume_content:
        content = latest_resume_content
    elif file_type == "cover" and latest_cover_letter:
        content = latest_cover_letter
    else:
        return {"error": "No content available for download"}
    
    # Generate the PDF
    pdf_path = await generate_pdf(content, file_type)
    
    # Schedule cleanup of the temporary file
    background_tasks.add_task(lambda: os.unlink(pdf_path))
    
    return FileResponse(
        path=pdf_path,
        filename=f"{'optimized_resume' if file_type == 'resume' else 'cover_letter'}.pdf",
        media_type="application/pdf"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

