from typing import Optional
from schema import *
from agents import *
from document_parser import *
import time
from backend.utils import format

# Core async workflow
def analyze_resume_for_job(
    resume: Resume, 
    job_description: str, 
    additional_info: Optional[str] = None
) -> ResumeReasoning:
    
    return resume_analyzer_agent.run_sync(f"Candidate's Resume: {format(resume)}\n\nJob Description: {job_description}\n\n Extra information: {additional_info}").data

def optimize_resume(old_resume: str, new_resume: str) -> str:
    return resume_optimizer_agent.run_sync(f"Old Resume: {format(old_resume)}\n\n New_Resume: {format(new_resume)}").data

def generate_resume(
    resume: Resume, 
    job_description: str, 
    additional_info: Optional[str] = None

    ) -> tuple[Resume, JobResumeDescription]: # ResumeCoverAnalysis
    
    resume_job_desc = JobResumeDescription(
        job_description=job_description,
        resume=resume,
        additional_info=additional_info
    )
    resume = resume_cover_generator.run_sync(f"Candidate's Resume: {format(resume)}\n\nJob Description{job_description}\n\nAdditional Info: {additional_info}").data
    resume_job_desc.resume = resume
    return resume, resume_job_desc

def generate_interview_questions(
    jobresume: JobResumeDescription,
) -> InterviewQuestions:
    return interview_question_generator_agent.run_sync(f"Candidate's Resume: {format(jobresume.resume)}\n\nJob Description{jobresume.job_description}\n\nAdditional Info: {jobresume.additional_info}", deps=jobresume).data

def find_similar_jobs(jobresume: JobResumeDescription) -> SimilarJobs:
    return job_search_agent.run_sync(format(jobresume), deps=jobresume).data

def process(
    resume: str, 
    job_description: str, 
    additional_info: Optional[str] = None
) -> tuple[ResumeReasoning, JobResumeDescription, ResumeCover, InterviewQuestions, SimilarJobs]:
    
    # Parse resume
    resume_ = resume_parser_agent.run_sync(f"{resume}", deps=resume).data
    print("Resume structure: ", resume_)
    
    # print("Format string: ", format(resume_))
    
    # Analyze resume
    resume_reasoning = analyze_resume_for_job(resume_, job_description, additional_info)
    
    print("Resume Analytics: ", format(resume_reasoning))
    
    # Generate cover letter
    new_resume, jobresume = generate_resume(resume_, job_description, additional_info)
    
    print("Resume: ", format(resume))
    
    # Optimize resume
    # optimized_resume = optimize_resume(resume_, format(new_resume))
    
    # print("Optimized Resume:", optimized_resume)
    
    # time.sleep(60)
    # Generate interview questions
    interview_questions = generate_interview_questions(jobresume)
    print("interview_questions: ", format(interview_questions))
    
    # time.sleep(60)
    # # Find similar jobs
    # similar_jobs = find_similar_jobs(jobresume)
    # print("Similar jobs: ", format(similar_jobs))

    return new_resume, resume_reasoning,  interview_questions #, similar_jobs


# Entry point
if __name__ == "__main__":
    import asyncio
    from resume_sample import resume, job_description, additional_information
    
    

    # async def main():
    results = process(resume, job_description, additional_information)
        # print(results)

    # asyncio.run(main())
