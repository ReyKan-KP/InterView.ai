import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "@/components/translations-context"

export const Welcome = () => {
  const { t } = useTranslations()
  
  return (
    <div className="text-center mb-8 rounded-lg p-4">
      <div className="flex justify-center items-center mx-auto gap-2 h-full w-full mb-2">
        <Badge variant="outline" className="text-sm">Powered by AI</Badge>
      </div>
      <h1 className="text-4xl font-bold mb-4 motion-preset-slide-up-lg">
        InterView AI
      </h1>
      <p className="max-w-2xl mx-auto motion-preset-slide-down">
        Practice for your next job interview with our AI-powered interview simulator.
        Select your interview type and job position to get started.
      </p>
    </div>
  )
} 

export default Welcome;