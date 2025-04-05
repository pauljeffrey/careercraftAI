import { Upload, FileText, Zap, Download } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: <Upload className="h-12 w-12 text-blue-600" />,
      title: "Upload Your Resume",
      description: "Start by uploading your existing resume in PDF, DOCX, or text format.",
    },
    {
      icon: <FileText className="h-12 w-12 text-blue-600" />,
      title: "Add Job Description",
      description: "Paste the job description you're interested in applying for.",
    },
    {
      icon: <Zap className="h-12 w-12 text-blue-600" />,
      title: "AI Optimization",
      description: "Our AI analyzes both documents and generates optimized application materials.",
    },
    {
      icon: <Download className="h-12 w-12 text-blue-600" />,
      title: "Get Results",
      description: "Download your tailored resume, cover letter, and interview preparation materials.",
    },
  ]

  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-blue-800">How It Works</h2>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-blue-200 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-white p-6 rounded-full shadow-md mb-6 z-10">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-blue-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

