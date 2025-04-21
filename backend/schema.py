from pydantic import BaseModel
from typing import List, Optional

# Pydantic models for structured output
class InterviewQuestion(BaseModel):
    question: str
    suggestedAnswer: Optional[str] = None
    questionreason: Optional[str] = None
    Questioner: str

class InterviewQuestions(BaseModel):
    questions: List[InterviewQuestion]
    
class SimilarJob(BaseModel):
    title: str
    company: str
    url: str
    location: Optional[str] = None

class SimilarJobs(BaseModel):
    jobs: List[SimilarJob]
    
class Address(BaseModel):
    street: str = None
    city: str = None
    state: str = None
    zip_code: str= None
    country: str = None
    
    def to_str(self):
        return f"{self.street}, {self.city}, {self.state}, {self.postal_code}, {self.country}"

class CoverLetter(BaseModel):
    Candidate_name: str
    Candidate_address: Address
    recipient_name_or_office: str
    recipient_title: str
    recipient_company: str
    company_address: Address
    title: str
    body: str
    closing: str
    
    def to_dict(self):
        return {
            "candidate_name": self.candidate_name,
            "candidate_address": self.candidate_address.to_dict(),
            "recipient_name_or_office": self.recipient_name_or_office,
            "recipient_title": self.recipient_title,
            "recipient_company": self.recipient_company,
            "company_address": self.company_address.to_dict(),
            "title": self.title,
            "body": self.body,
            "closing": self.closing
        }
   

class ResumeCover(BaseModel):
    resume: str
    cover_letter: str
    
class Skill(BaseModel):
    name: str
    level: Optional[str] = None
    year_of_experience: Optional[int]= None
    description: Optional[str]= None
    
class AdditionalInfo(BaseModel):
    title: str
    description: str
    
class WorkExperience(BaseModel):
    title: str
    company: str
    start_date: str
    end_date: str
    description: str
    achievements: str
    responsibilities: str
    
    
class Education(BaseModel):
    degree: str
    institution: str
    start_date: str
    end_date: str
    description: str        
    
class Certification(BaseModel):
    name: str
    issuing_organization: str
    issue_date: str
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    
class project(BaseModel):
    name: str
    description: str
    technologies_used: List[str]
    link: Optional[str] = None
    
class VolunteerExperience(BaseModel):
    organization: str
    role: str
    start_date: str
    end_date: str
    description: str
    
class Publication(BaseModel):
    title: str
    publication_date: str
    link: Optional[str] = None
    
class Award(BaseModel):
    title: str
    organization: str
    date_received: str
    description: str
    
class Reference(BaseModel):
    name: str
    title: str
    organization: str
    contact_info: str
    
class ResumeSections(BaseModel):
    professional_summary: str
    skills: List[Skill]
    experience: List[WorkExperience]
    education: List[Education]
    certifications: List[Certification]
    projects: List[project]
    languages: List[str] 
    interests: List[str]
    volunteer_experience: List[VolunteerExperience]
    publications: List[Publication]
    awards: List[Award]
    references: List[Reference]
    additional_sections: List[AdditionalInfo]

class Resume(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    sections: ResumeSections
    
    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "linkedin": self.linkedin,
            "github": self.github,
            "website": self.website,
            "professional_summary": self.sections.professional_summary,
            "skills": [s.dict() for s in self.sections.skills],
            "experience": [e.dict() for e in self.sections.experience],
            "education": [e.dict() for e in self.sections.education],
            "certifications": [c.dict() for c in self.sections.certifications],
            "projects": [p.dict() for p in self.sections.projects],
            "languages": self.sections.languages,
            "interests": self.sections.interests,
            "volunteer_experience": [v.dict() for v in self.sections.volunteer_experience],
            "publications": [p.dict() for p in self.sections.publications],
            "awards": [a.dict() for a in self.sections.awards],
            "references": [r.dict() for r in self.sections.references],
            "additional_sections": [a.dict() for a in self.sections.additional_sections],
        }


class ResumeJobDescription(BaseModel):
    resume: Resume
    job_description: str

    
class JobResumeDescription(BaseModel):
    job_description: str
    resume: Resume
    additional_info: Optional[str] = None
    
class ResumeReasoning(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    personality: List[str]
    career_recommendations: List[str]
    skill_to_learn: List[Skill]
    coverLetter: CoverLetter
    job_being_applied_for: str = None
    
class JobApplicationResult(BaseModel):
    # optimizedResume: Optional[str] = None
    reasoning: Optional[ResumeReasoning] = None
    coverLetter: Optional[CoverLetter] = None
    missingSkills: Optional[List[str]] = None
    interviewQuestions: Optional[List[InterviewQuestion]] = None
    similarJobs: Optional[List[SimilarJob]] = None
    
class ResumeCoverAnalysis(BaseModel):
    resume: Resume
    cover_letter: CoverLetter
    analysis: ResumeReasoning