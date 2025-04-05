import { Target, Users, Shield } from "lucide-react"

export function MissionSection() {
  const values = [
    {
      icon: <Target className="h-12 w-12 text-blue-600 mb-4" />,
      title: "Our Mission",
      description:
        "To democratize the job application process by giving every candidate access to professional-grade tools that optimize their applications.",
    },
    {
      icon: <Users className="h-12 w-12 text-blue-600 mb-4" />,
      title: "Our Vision",
      description:
        "A world where job seekers are evaluated on their true potential, not their ability to craft the perfect application materials.",
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-600 mb-4" />,
      title: "Our Values",
      description:
        "Fairness, accessibility, and innovation drive everything we do. We believe technology should level the playing field for all job seekers.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
      {values.map((value, index) => (
        <div key={index} className="text-center p-6 bg-blue-50 rounded-lg">
          <div className="flex justify-center">{value.icon}</div>
          <h3 className="text-xl font-semibold mb-3 text-blue-800">{value.title}</h3>
          <p className="text-gray-700">{value.description}</p>
        </div>
      ))}
    </div>
  )
}

