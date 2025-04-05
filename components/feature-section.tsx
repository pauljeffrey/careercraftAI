import { FileText, PenTool, Lightbulb, MessageSquare, Search, Globe } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-blue-600" />,
      title: "Resume Optimization",
      description:
        "Our AI analyzes your resume against job descriptions to highlight relevant skills and experiences, increasing your match rate.",
    },
    {
      icon: <PenTool className="h-10 w-10 text-blue-600" />,
      title: "Custom Cover Letters",
      description:
        "Generate personalized cover letters that showcase your qualifications and enthusiasm for each specific position.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-blue-600" />,
      title: "Skills Gap Analysis",
      description:
        "Identify missing skills and get recommendations for improvements to make your profile more competitive.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-blue-600" />,
      title: "Interview Preparation",
      description:
        "Get predicted interview questions based on the job description and your resume, with suggested answers tailored to your experience.",
    },
    {
      icon: <Search className="h-10 w-10 text-blue-600" />,
      title: "Similar Job Matching",
      description: "Discover related job opportunities that match your skills and experience from across the web.",
    },
    {
      icon: <Globe className="h-10 w-10 text-blue-600" />,
      title: "Multi-language Support",
      description: "Use our tools in multiple languages to apply for jobs globally with confidence.",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-blue-800">
          Powerful Features to Boost Your Job Search
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

