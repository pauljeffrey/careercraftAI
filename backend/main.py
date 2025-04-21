from fastapi import FastAPI, File, UploadFile, Form#, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import asyncio
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from backend.utils import periodic_file_cleanup
from backend.agent_call import process
from backend.document_parser import extract_text_and_images_from_resume
from backend.file_generator import create_cover_letter_docx, create_interview_question_pdf, create_resume_docx, create_resume_pdf
from fastapi import HTTPException
from urllib.parse import unquote

app = FastAPI(title="ResumeCraft AI API")

# Serve files from a "downloads" directory
DOWNLOAD_DIR = Path("downloads")
DOWNLOAD_DIR.mkdir(exist_ok=True)
app.mount("/downloads", StaticFiles(directory=DOWNLOAD_DIR), name="downloads")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(periodic_file_cleanup())
    

@app.post("/api/optimize")
async def optimize_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    additional_info: str = Form(""),
    language: str = Form("english")
):
    """
    Process the resume and job description to generate optimized application materials.
    Returns all results at once instead of streaming.
    """
    try:
        # Extract text from the resume
        resume_text, format_type, images  = await extract_text_and_images_from_resume(resume)
    
        # Process the resume (non-streaming)
        resume, resume_reasoning, interview_questions = process(
            resume_text, 
            job_description, 
            additional_info
        )
        
        if format_type == 'docx':
            create_resume_docx(resume, DOWNLOAD_DIR / f"{resume.name}_{resume_reasoning.job_being_applied_for}.docx", image_bytes = images[0] if images else None)
        else:
            format_type = 'pdf'
            create_resume_pdf(resume, DOWNLOAD_DIR / f"{resume.name}_{resume_reasoning.job_being_applied_for}.pdf", image_bytes= images[0] if images else None)
            
        ## Generate cover letter
        if resume_reasoning.coverLetter:
            create_cover_letter_docx(resume_reasoning.coverLetter, DOWNLOAD_DIR / f"{resume.name}_{resume_reasoning.job_being_applied_for}_cover_letter.docx")
        
        # Generate interview questions PDF
        if interview_questions:
            create_interview_question_pdf(interview_questions, DOWNLOAD_DIR / f"{resume.name}_{resume_reasoning.job_being_applied_for}_interview_questions.pdf")
            
        # Format the results for the frontend
        results = {
        
            "text": {
            "recommendations": resume_reasoning.career_recommendations,
            "strengths": resume_reasoning.strengths,
            "weaknesses": resume_reasoning.weaknesses,
            "personality": resume_reasoning.personality,
            "skillsToLearn": resume_reasoning.skill_to_learn,
            "coverLetter": resume_reasoning.coverLetter.text if resume_reasoning.coverLetter else None,
            "interviewQuestions": interview_questions if interview_questions else None,
        },
        "files": {
            "resumeURL": DOWNLOAD_DIR / f"{resume.name}_{resume_reasoning.job_being_applied_for}.{format_type}",
            "coverLetterURL": DOWNLOAD_DIR / f"{resume.name}_{resume_reasoning.job_being_applied_for}_cover_letter.docx",
            "interviewQuestionsURL": DOWNLOAD_DIR / f"{resume.name}_{resume_reasoning.job_being_applied_for}_interview_questions.pdf",
        }
        }
        
        return JSONResponse(content=results)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.get("/api/download/{file_path:path}")
async def download_file(file_path: str):
    """
    Download a previously generated file from the 'downloads' directory.

    Args:
        file_path: The relative path to the file, as returned in the `files` section of the optimize_resume response.

    Returns:
        The requested file as a downloadable response.
    """
    try:
        # Decode any URL-encoded characters (e.g., spaces as %20)
        decoded_path = unquote(file_path)

        # Resolve full path and prevent path traversal
        full_path = (DOWNLOAD_DIR / decoded_path).resolve()

        # Ensure the file is inside the DOWNLOAD_DIR to prevent directory traversal attack
        if not str(full_path).startswith(str(DOWNLOAD_DIR.resolve())):
            raise HTTPException(status_code=403, detail="Access denied")

        if not full_path.exists():
            raise HTTPException(status_code=404, detail="File not found")

        # Infer media type from extension
        ext = full_path.suffix.lower()
        media_type = {
            ".pdf": "application/pdf",
            ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".txt": "text/plain"
        }.get(ext, "application/octet-stream")

        return FileResponse(
            path=full_path,
            filename=full_path.name,
            media_type=media_type
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

        

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
