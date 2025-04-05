"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface JobApplicationFormProps {
  onSubmit: (formData: any) => void
  isLoading: boolean
}

export function JobApplicationForm({ onSubmit, isLoading }: JobApplicationFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [language, setLanguage] = useState("english")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!resumeFile || !jobDescription) {
      return
    }

    const formData = {
      resumeFile,
      jobDescription,
      additionalInfo,
      language,
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="resume">Upload Your Resume</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-blue-50 transition-colors cursor-pointer">
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => e.target.files && setResumeFile(e.target.files[0])}
          />
          <label htmlFor="resume" className="cursor-pointer">
            {resumeFile ? (
              <div className="text-blue-600 font-medium">{resumeFile.name}</div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-blue-600 mb-2" />
                <p className="text-gray-700 mb-1">Drag and drop your resume here or click to browse</p>
                <p className="text-sm text-gray-500">Supports PDF, DOCX, and TXT (Max 5MB)</p>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-description">Job Description</Label>
        <Textarea
          id="job-description"
          placeholder="Paste the job description here..."
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional-info">Additional Information (Optional)</Label>
        <Textarea
          id="additional-info"
          placeholder="Add any additional information about the job or your qualifications..."
          rows={3}
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language" className="w-full">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <Globe className="h-4 w-4 mr-1" />
          <span>Output will be generated in your selected language</span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={!resumeFile || !jobDescription || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Optimize My Application"
        )}
      </Button>
    </form>
  )
}

