"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JobApplicationForm } from "@/components/job-application-form"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

export default function Agent() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  // Function to simulate progress while waiting for the backend
  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 10, 95)
        return newProgress
      })
    }, 1000)

    return interval
  }

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true)

      // Start progress simulation
      const progressInterval = simulateProgress()

      // Create form data for file upload
      const apiFormData = new FormData()
      apiFormData.append("resume", formData.resumeFile)
      apiFormData.append("job_description", formData.jobDescription)
      apiFormData.append("additional_info", formData.additionalInfo || "")
      apiFormData.append("language", formData.language || "en")

      // Send to the backend
      const response = await fetch("http://localhost:8000/api/optimize", {
        method: "POST",
        body: apiFormData,
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      // Parse the JSON response
      const results = await response.json()

      // Stop progress simulation
      clearInterval(progressInterval)
      setProgress(100)

      // Save results to localStorage to pass to results page
      localStorage.setItem("resumeResults", JSON.stringify(results))

      // Navigate to results page after a short delay to show 100% progress
      setTimeout(() => {
        router.push("/agent/results")
      }, 500)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to process your application. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Job Application Assistant</h1>

        <Card className="max-w-4xl mx-auto p-6 shadow-lg">
          {isLoading && (
            <div className="mb-8">
              <p className="text-center mb-2 text-blue-600 font-medium">
                Analyzing your resume and optimizing it for the job description...
              </p>
              <Progress value={progress} className="h-2" />
              <p className="text-center mt-2 text-sm text-gray-500">
                This may take a few minutes. We're crafting personalized content for you.
              </p>
            </div>
          )}

          <JobApplicationForm onSubmit={handleSubmit} isLoading={isLoading} />
        </Card>
      </div>

      <Footer />
    </main>
  )
}
