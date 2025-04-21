from pydantic_ai import RunContext
from schema import JobResumeDescription
from pydantic import BaseModel
from typing import Any
import asyncio
from pathlib import Path
import time

DOWNLOAD_DIR = Path("downloads")

def format(obj: Any, indent: int = 0) -> str:
    space = '  ' * indent

    if isinstance(obj, BaseModel):
        lines = []
        for field_name, value in obj:
            field_name = field_name.replace('_', ' ').title()
            lines.append(f"{space}{field_name}: {format(value, indent + 1)}")
            # lines.append(format(value, indent + 1))
        return "\n".join(lines)
    
    elif isinstance(obj, list):
        if not obj:
            return f"{space}N/A"
        return "\n".join(f"{format(item, indent)}" for item in obj)

    elif isinstance(obj, dict):
        return "\n".join(f"{space}{k}: {format(v, indent + 1)}" for k, v in obj.items())

    else:
        return f"{space}{obj}"


def get_resume(ctx: RunContext[JobResumeDescription]) -> str:
    """get the user's resume (curriculum vitae) """
    return format(ctx.deps.resume)

def get_job_info(ctx: RunContext[JobResumeDescription]) -> str:
    """get the job description for which the user wants to apply """
    return ctx.deps.job_description

def get_additional_info(ctx: RunContext[JobResumeDescription]) -> str:
    """get any additional information provided by the user to help with the job application """
    return ctx.deps.additional_info if ctx.deps.additional_info else ""

def get_job_resume_desc(ctx: RunContext[JobResumeDescription]) -> str:
    """Get:
    1. the job description for which user wants to apply
    2. the user's resume (curriculum vitae)
    3. any additional information provided by the user to help with the job application
    """
    return f"Resume: {format(ctx.deps.resume)}\n\nJob Description: {ctx.deps.job_description}\n\nAdditional Info: {ctx.deps.additional_info}"


def delete_old_files(directory: Path, max_age_minutes: int = 30):
    now = time.time()
    max_age = max_age_minutes * 60  # convert to seconds

    for file_path in directory.iterdir():
        if file_path.is_file():
            file_age = now - file_path.stat().st_mtime
            if file_age > max_age:
                print(f"Deleting old file: {file_path}")
                try:
                    file_path.unlink()
                except Exception as e:
                    print(f"Error deleting file {file_path.name}: {e}")
                    

async def periodic_file_cleanup():
    while True:
        delete_old_files(DOWNLOAD_DIR, max_age_minutes=30)
        await asyncio.sleep(1800)  # wait 30 minutes


async def periodic_file_cleanup():
    while True:
        delete_old_files(DOWNLOAD_DIR, max_age_minutes=30)
        await asyncio.sleep(1800)  # wait 30 minutes

