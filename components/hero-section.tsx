"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, FileCheck, PenTool, Briefcase, Search, MessageSquare } from "lucide-react"

export function HeroSection() {
  const [currentIcon, setCurrentIcon] = useState(0)
  const icons = [
    { icon: <FileText size={28} />, label: "Upload Resume" },
    { icon: <Search size={28} />, label: "Add Job Description" },
    { icon: <FileCheck size={28} />, label: "Optimize Resume" },
    { icon: <PenTool size={28} />, label: "Generate Cover Letter" },
    { icon: <MessageSquare size={28} />, label: "Prepare for Interviews" },
    { icon: <Briefcase size={28} />, label: "Find Similar Jobs" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
              Land Your Dream Job with AI-Powered Applications
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              CareerCraft AI optimizes your resume, writes personalized cover letters, and prepares you for
              interviews—all tailored to each job you apply for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/agent">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Try It Now — It's Free
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 bg-white rounded-full shadow-xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-dashed animate-spin-slow"></div>

              {icons.map((item, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: currentIcon === index ? 1 : 0,
                    scale: currentIcon === index ? 1 : 0.8,
                    x: Math.cos((2 * Math.PI * index) / icons.length) * 120,
                    y: Math.sin((2 * Math.PI * index) / icons.length) * 120,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className={`flex flex-col items-center ${currentIcon === index ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div className="bg-white p-3 rounded-full shadow-md mb-2">{item.icon}</div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </motion.div>
              ))}

              <div className="bg-blue-600 text-white rounded-full p-6 z-10">
                <span className="text-xl font-bold">CareerCraft AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

