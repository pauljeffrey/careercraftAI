import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface TeamMemberProps {
  name: string
  role: string
  bio: string
  imageUrl: string
}

export function TeamMember({ name, role, bio, imageUrl }: TeamMemberProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className="relative h-64 w-full">
        <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-1 text-blue-800">{name}</h3>
        <p className="text-blue-600 font-medium mb-3">{role}</p>
        <p className="text-gray-700 text-sm">{bio}</p>
      </CardContent>
    </Card>
  )
}

