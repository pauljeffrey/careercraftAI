import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TeamMember } from "@/components/team-member"
import { MissionSection } from "@/components/mission-section"

export default function About() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">About CareerCraft AI</h1>

        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-lg mb-6 text-gray-700">
            CareerCraft AI was born from a simple observation: job seekers spend countless hours tailoring resumes and
            cover letters for each application, often without knowing if they're highlighting the right skills and
            experiences.
          </p>
          <p className="text-lg mb-6 text-gray-700">
            Our mission is to democratize the job application process by giving every candidate access to AI-powered
            tools that optimize their applications, saving time and increasing their chances of landing interviews.
          </p>
          <p className="text-lg text-gray-700">
            Using advanced natural language processing and machine learning algorithms, CareerCraft AI analyzes job
            descriptions and your resume to create perfectly tailored application materials that highlight your most
            relevant qualifications.
          </p>
        </div>

        <MissionSection />

        <h2 className="text-3xl font-bold text-center mt-20 mb-12 text-blue-800">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <TeamMember
            name="Alex Johnson"
            role="Founder & CEO"
            bio="Former tech recruiter with 10+ years of experience who saw firsthand how qualified candidates were overlooked due to poorly optimized resumes."
            imageUrl="/placeholder.svg?height=300&width=300"
          />
          <TeamMember
            name="Sophia Chen"
            role="AI Engineer"
            bio="PhD in Natural Language Processing with expertise in building AI systems that understand context and generate human-like text."
            imageUrl="/placeholder.svg?height=300&width=300"
          />
          <TeamMember
            name="Marcus Williams"
            role="Career Coach"
            bio="Certified career counselor who helps shape our AI recommendations based on real-world hiring practices across various industries."
            imageUrl="/placeholder.svg?height=300&width=300"
          />
        </div>
      </div>

      <Footer />
    </main>
  )
}

