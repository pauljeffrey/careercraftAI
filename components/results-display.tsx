"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ExternalLink, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultsDisplayProps {
  results: {
    optimizedResume: string
    reasoning: {
      strengths: string[]
      weaknesses: string[]
    }
    coverLetter: string
    missingSkills: string[]
    interviewQuestions: {
      question: string
      suggestedAnswer: string
    }[]
    similarJobs: {
      title: string
      company: string
      url: string
    }[]
  }
  onDownload: (type: string) => void
}

export function ResultsDisplay({ results, onDownload }: ResultsDisplayProps) {
  return (
    <Tabs defaultValue="resume">
      <TabsContent value="resume" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Optimized Resume</h3>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">{results.optimizedResume}</div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => onDownload("resume")}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analysis" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Resume Analysis</h3>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3 text-green-700 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Strengths
              </h4>
              <ul className="list-disc pl-6 space-y-2">
                {results.reasoning.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-3 text-red-700 flex items-center">
                <XCircle className="mr-2 h-5 w-5" />
                Areas for Improvement
              </h4>
              <ul className="list-disc pl-6 space-y-2">
                {results.reasoning.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-gray-700">
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cover" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Personalized Cover Letter</h3>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">{results.coverLetter}</div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => onDownload("cover")}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Cover Letter
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skills" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Skills Gap Analysis</h3>
            <p className="mb-4 text-gray-700">
              Based on the job description, consider developing these skills to strengthen your application:
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {results.missingSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Skill Development Resources</h4>
              <p className="text-sm text-yellow-700">
                We recommend online courses, certifications, or projects to develop these skills. Consider platforms
                like Coursera, Udemy, or LinkedIn Learning.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="interview" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Interview Preparation</h3>
            <p className="mb-4 text-gray-700">
              Based on the job description and your resume, prepare for these likely interview questions:
            </p>

            <div className="space-y-6">
              {results.interviewQuestions.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-blue-50 p-4 border-b border-gray-200">
                    <h4 className="font-medium text-blue-800">{item.question}</h4>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-gray-700 whitespace-pre-line">{item.suggestedAnswer}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="jobs" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Similar Job Opportunities</h3>
            <p className="mb-4 text-gray-700">
              Based on your skills and the job you're applying for, here are similar opportunities:
            </p>

            <div className="space-y-4">
              {results.similarJobs.map((job, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-blue-800 mb-1">{job.title}</h4>
                  <p className="text-gray-700 mb-2">{job.company}</p>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm"
                  >
                    View Job <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

