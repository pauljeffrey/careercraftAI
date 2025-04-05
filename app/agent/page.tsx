"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JobApplicationForm } from "@/components/job-application-form"
import { ResultsDisplay } from "@/components/results-display"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function Agent() {
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [streamedResults, setStreamedResults] = useState({
    optimizedResume: "",
    reasoning: {
      strengths: [],
      weaknesses: [],
    },
    coverLetter: "",
    missingSkills: [],
    interviewQuestions: [],
    similarJobs: [],
  })
  const [isStreaming, setIsStreaming] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true)
      setIsStreaming(true)
      setStreamedResults({
        optimizedResume: "",
        reasoning: {
          strengths: [],
          weaknesses: [],
        },
        coverLetter: "",
        missingSkills: [],
        interviewQuestions: [],
        similarJobs: [],
      })

      // Create form data for file upload
      const apiFormData = new FormData()
      apiFormData.append("resume", formData.resumeFile)
      apiFormData.append("job_description", formData.jobDescription)
      apiFormData.append("additional_info", formData.additionalInfo || "")
      apiFormData.append("language", formData.language)

      // Start streaming response
      const response = await fetch("http://localhost:8000/api/optimize", {
        method: "POST",
        body: apiFormData,
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      // Process the streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let partialData = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        partialData += chunk

        try {
          // Try to parse the accumulated data
          // The server might send multiple JSON objects in the stream
          const jsonObjects = partialData.split("\n").filter((line) => line.trim())

          // Process each complete JSON object
          for (let i = 0; i < jsonObjects.length - 1; i++) {
            const jsonData = JSON.parse(jsonObjects[i])
            updateStreamedResults(jsonData)
          }

          // Keep the last (potentially incomplete) part
          partialData = jsonObjects[jsonObjects.length - 1] || ""
        } catch (e) {
          // If we can't parse, it's likely an incomplete JSON object
          // Just continue and wait for more data
        }
      }

      // Process any remaining data
      if (partialData) {
        try {
          const jsonData = JSON.parse(partialData)
          updateStreamedResults(jsonData)
        } catch (e) {
          console.error("Error parsing final chunk:", e)
        }
      }

      setIsStreaming(false)
      setResults(streamedResults)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to process your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateStreamedResults = (data) => {
    setStreamedResults((prev) => {
      const newResults = { ...prev }

      // Update each field if it exists in the incoming data
      if (data.optimizedResume) newResults.optimizedResume = data.optimizedResume

      if (data.reasoning) {
        if (data.reasoning.strengths) newResults.reasoning.strengths = data.reasoning.strengths
        if (data.reasoning.weaknesses) newResults.reasoning.weaknesses = data.reasoning.weaknesses
      }

      if (data.coverLetter) newResults.coverLetter = data.coverLetter

      if (data.missingSkills) newResults.missingSkills = data.missingSkills

      if (data.interviewQuestions) newResults.interviewQuestions = data.interviewQuestions

      if (data.similarJobs) newResults.similarJobs = data.similarJobs

      return newResults
    })
  }

  // When streaming is complete, set the final results
  useEffect(() => {
    if (!isStreaming && streamedResults.optimizedResume) {
      setResults(streamedResults)
    }
  }, [isStreaming, streamedResults])

  const handleDownloadPdf = async (type) => {
    try {
      const response = await fetch(`http://localhost:8000/api/download/${type}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = type === "resume" ? "optimized_resume.pdf" : "cover_letter.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error(`Error downloading ${type}:`, error)
      toast({
        title: "Download Failed",
        description: `Could not download the ${type}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Job Application Assistant</h1>

        <Card className="max-w-4xl mx-auto p-6 shadow-lg">
          {!results ? (
            <JobApplicationForm onSubmit={handleSubmit} isLoading={isLoading} />
          ) : (
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="grid grid-cols-6 mb-8">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="cover">Cover Letter</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="interview">Interview</TabsTrigger>
                <TabsTrigger value="jobs">Similar Jobs</TabsTrigger>
              </TabsList>
              <ResultsDisplay results={results} onDownload={handleDownloadPdf} />
              <div className="mt-8 text-center">
                <button
                  onClick={() => setResults(null)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </Tabs>
          )}
        </Card>
      </div>

      <Footer />
    </main>
  )
}

