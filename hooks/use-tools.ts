"use client"

import { toast } from "sonner"
import confetti from 'canvas-confetti'
import { animate as framerAnimate } from "framer-motion"
import { useTranslations } from "@/components/translations-context"
import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

export const useToolsFunctions = () => {
  const { t } = useTranslations();

  const saveInterviewFeedback = ({ strengths, weaknesses, overallRating, recommendations }: { 
    strengths: string,
    weaknesses: string,
    overallRating: string,
    recommendations: string
  }) => {
    try {
      // Create a feedback object with timestamp
      const feedback = {
        timestamp: new Date().toISOString(),
        strengths,
        weaknesses,
        overallRating,
        recommendations
      };
      
      // Save to localStorage for persistence between sessions
      const savedFeedback = JSON.parse(localStorage.getItem('interviewFeedback') || '[]');
      savedFeedback.push(feedback);
      localStorage.setItem('interviewFeedback', JSON.stringify(savedFeedback));
      
      // Show success toast
      toast.success("Interview feedback saved! 📝", {
        description: "The feedback has been saved and can be viewed later.",
      });
      
      return {
        success: true,
        message: "I've saved your interview feedback. Here's a summary: Overall rating: " + overallRating + ". Key strengths: " + strengths + ". Areas to improve: " + weaknesses + ". Recommendations: " + recommendations
      };
    } catch (error) {
      return {
        success: false,
        message: `Error saving feedback: ${error}`
      };
    }
  }

  return {
    saveInterviewFeedback
  }
}