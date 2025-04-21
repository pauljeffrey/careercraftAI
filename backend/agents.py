from pydantic_ai import Agent, RunContext
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.providers.google_gla import GoogleGLAProvider
from httpx import AsyncClient
from prompts import *
from schema import *
from backend.utils import *
from pydantic_ai.common_tools.duckduckgo import duckduckgo_search_tool
from dotenv import load_dotenv
import os

load_dotenv()

model_name = os.getenv('MODEL_NAME', 'gemini-1.5-pro').strip()
model_provider = os.getenv('MODEL_PROVIDER', 'google-gla')

print(model_name)

model = GeminiModel(model_name, provider=model_provider) #gemini-1.5-pro gemini-2.0-flash  gemini-2.0-flash
# agent = Agent(model)
# agent = Agent('google-gla:gemini-2.0-flash')


# custom_http_client = AsyncClient(timeout=30)
# model = GeminiModel(
#     'gemini-2.0-flash',
#     provider=GoogleGLAProvider(api_key='your-api-key', http_client=custom_http_client),
# )
# agent = Agent(model)


resume_parser_agent = Agent(model, 
                            # deps_type = str,
                            result_type = Resume,
                            system_prompt = resume_parser_prompt,
                            )


resume_cover_generator = Agent(model, 
                            #    deps_type = ResumeJobDescription,
                            #    tools = [get_job_resume_desc], #duckduckgo_search_tool()
                               result_type = Resume,
                               system_prompt = resume_generator_prompt,
                               )


resume_optimizer_agent = Agent(model, 
                            #    deps_type = List[str],
                                 result_type = str,
                                 system_prompt = resume_optimizer_prompt,
                                 )

interview_question_generator_agent = Agent(model, 
                                          #  deps_type = JobResumeDescription,
                                           tools = [duckduckgo_search_tool()], #, get_job_resume_desc],
                                            result_type = InterviewQuestions,
                                            system_prompt = interview_question_generator_prompt,
                                            )

job_search_agent = Agent(model,
                        deps_type = JobResumeDescription,
                        result_type = SimilarJobs,
                        tools = [duckduckgo_search_tool(),get_job_info, get_resume],
                        system_prompt = job_search_prompt,
                        )

resume_analyzer_agent = Agent(model,
                        result_type = ResumeReasoning,
                        # tools = [duckduckgo_search_tool()],
                        system_prompt = job_search_prompt,
                        )

