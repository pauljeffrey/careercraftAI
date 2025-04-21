"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowLeft, CheckCircle, XCircle, User, Briefcase, Lightbulb, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Results() {
  const [results, setResults] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Get results from localStorage
    const savedResults = localStorage.getItem("resumeResults")

    if (savedResults) {
      setResults(JSON.parse(savedResults))
    } else {
      // If no results, redirect back to agent page
      router.push("/agent")
    }
  }, [router])

  const handleDownload = async (downloadFilePath) => {
    try {
      const response = await fetch(`http://localhost:8000/api/download/${downloadFilePath}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = type === "resume" ? "optimized_resume" : "cover_letter.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error(`Error downloading ${downloadFilePath}:`, error)
      toast({
        title: "Download Failed",
        description: `Could not download the ${downloadFilePath}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  if (!results) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto py-12 px-4 flex items-center justify-center flex-1">
          <p>Loading results...</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/agent")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-blue-800">Your Optimized Application</h1>
        </div>

        <div className="flex justify-end mb-6 gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleDownload(results.files.resumeURL)}>
            <Download className="mr-2 h-4 w-4" />
            Download Resume
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleDownload(results.files.coverLetterURL)}>
            <Download className="mr-2 h-4 w-4" />
            Download Cover Letter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleDownload(results.files.interviewQuestionsURL)}>
            <Download className="mr-2 h-4 w-4" />
            Download Interview Questions
          </Button>
        </div>

        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="cover">Cover Letter</TabsTrigger>
            <TabsTrigger value="skills">Skills & Career Recommendations</TabsTrigger>
            <TabsTrigger value="interview">Interview Prep</TabsTrigger>
          </TabsList>

          {/* Resume Tab */}
          <TabsContent value="resume" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">Optimized Resume</h3>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => handleDownload("resume")}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
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
                    {results.text.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-700">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-red-700 flex items-center">
                    <XCircle className="mr-2 h-5 w-5" />
                    Areas for Improvement
                  </h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {results.text.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-700">
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-blue-700 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personality Traits
                  </h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {results.text.personality.map((trait, index) => (
                      <li key={index} className="text-gray-700">
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cover Letter Tab */}
          <TabsContent value="cover" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">Personalized Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">{results.coverLetter}</div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => handleDownload("cover")}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Cover Letter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills & Career Tab */}
          <TabsContent value="skills" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">Skills & Career Recommendations</h3>

                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-blue-700 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Skills to Learn
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.text.skillsToLearn.map((skill, index) => (
                      <div key={index} className="border border-blue-100 rounded-md p-4 bg-blue-50">
                        <h5 className="font-semibold text-blue-800 mb-1">{skill.name}</h5>
                        <p className="text-sm text-gray-700 mb-2">{skill.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {skill.resources.map((resource, resourceIndex) => (
                            <Badge key={resourceIndex} variant="outline" className="bg-white">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-blue-700 flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Career Recommendations
                  </h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {results.text.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-gray-700">
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interview Prep Tab */}
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
                      <div className="flex items-center bg-blue-50 p-4 border-b border-gray-200">
                        <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-blue-800">{item.question}</h4>
                          <p className="text-xs text-blue-600 mt-1">Asked by: {item.Questioner || "Interviewer"}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        {item.questionReason && (
                          <div className="mb-3 text-sm text-gray-500 italic">
                            <strong>Why this might be asked:</strong> {item.questionreason}
                          </div>
                        )}
                        <p className="text-gray-700 whitespace-pre-line">{item.suggestedAnswer && (
                            <span className="font-semibold">Suggested Answer:</span> {item.suggestedAnswer}
                        )}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => router.push("/agent")}>
            Start a New Application
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  )
}
