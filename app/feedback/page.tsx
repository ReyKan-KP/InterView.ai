"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

interface Feedback {
  timestamp: string;
  strengths: string;
  weaknesses: string;
  overallRating: string;
  recommendations: string;
}

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Load feedback from localStorage
      const savedFeedback = JSON.parse(localStorage.getItem('interviewFeedback') || '[]');
      setFeedbackList(savedFeedback);
    } catch (error) {
      console.error("Error loading feedback:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Interview Feedback History</h1>
      </div>

      {loading ? (
        <p className="text-center py-10">Loading feedback...</p>
      ) : feedbackList.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-medium mb-4">No feedback available yet</h2>
          <p className="text-gray-500 mb-8">Complete an interview to receive feedback</p>
          <Link href="/">
            <Button>Start an Interview</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {feedbackList.map((feedback, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Badge>{feedback.overallRating}</Badge>
                  <span className="text-sm text-gray-500">{formatDate(feedback.timestamp)}</span>
                </div>
                <CardTitle>Interview Feedback</CardTitle>
                <CardDescription>Summary of your interview performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-green-600 mb-1">Strengths</h3>
                  <p className="text-sm">{feedback.strengths}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-amber-600 mb-1">Areas for Improvement</h3>
                  <p className="text-sm">{feedback.weaknesses}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-blue-600 mb-1">Recommendations</h3>
                  <p className="text-sm">{feedback.recommendations}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => {
                  const feedbackText = `
Interview Feedback
-----------------
Date: ${formatDate(feedback.timestamp)}
Overall Rating: ${feedback.overallRating}

Strengths:
${feedback.strengths}

Areas for Improvement:
${feedback.weaknesses}

Recommendations:
${feedback.recommendations}
`;
                  navigator.clipboard.writeText(feedbackText);
                  alert("Feedback copied to clipboard!");
                }}>
                  Copy to Clipboard
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
} 