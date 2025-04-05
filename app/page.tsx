import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { HowItWorksSection } from "@/components/how-it-works-section"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <TestimonialSection />
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-800">Ready to Land Your Dream Job?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
            Transform your job application process today with CareerCraft AI and increase your chances of getting hired.
          </p>
          <Link href="/agent">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Try It Now — It's Free
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}

