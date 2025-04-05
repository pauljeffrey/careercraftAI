import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "CareerCraft AI helped me land interviews at three top tech companies. The resume optimization highlighted skills I didn't know were valuable!",
      author: "Michael T.",
      role: "Software Engineer",
      company: "Hired at Google",
    },
    {
      quote:
        "After months of no responses, I used CareerCraft AI to tailor my applications. Within two weeks, I had five interview requests.",
      author: "Sarah L.",
      role: "Marketing Manager",
      company: "Hired at Adobe",
    },
    {
      quote:
        "The interview preparation was spot on. They predicted 80% of the questions I was asked and helped me craft perfect answers.",
      author: "David K.",
      role: "Data Scientist",
      company: "Hired at Microsoft",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-blue-800">Success Stories</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-8 bg-gradient-to-br from-blue-50 to-white">
                <Quote className="h-10 w-10 text-blue-300 mb-4" />
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-blue-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm font-medium text-blue-600">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

