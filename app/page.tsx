"use client"

import React, { useEffect, useState, useRef } from "react"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { tools } from "@/lib/tools"
import { Welcome } from "@/components/welcome"
import { VoiceSelector } from "@/components/voice-select"
import { BroadcastButton } from "@/components/broadcast-button"
import { StatusDisplay } from "@/components/status"
import { TokenUsageDisplay } from "@/components/token-usage"
import { MessageControls } from "@/components/message-controls"
import { TextInput } from "@/components/text-input"
import { VideoPlayer } from "@/components/video-player"
import { motion } from "framer-motion"
import { useToolsFunctions } from "@/hooks/use-tools"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const interviewTypes = [
  { value: "technical", label: "Technical Interview" },
  { value: "behavioral", label: "Behavioral Interview" },
  { value: "system-design", label: "System Design Interview" },
  { value: "general", label: "General Interview" },
  { value: "hr", label: "HR Interview" },
]

const App: React.FC = () => {
  // State for voice selection
  const [voice, setVoice] = useState("ash")
  
  // Interview settings
  const [interviewType, setInterviewType] = useState("technical")
  const [position, setPosition] = useState("Software Developer")
  const [customPosition, setCustomPosition] = useState("")
  const [feedbackEnabled, setFeedbackEnabled] = useState(true)
  const [interviewStarted, setInterviewStarted] = useState(false)
  
  // Track who is speaking
  const [isBotSpeaking, setIsBotSpeaking] = useState(false)
  const lastMsgIdRef = useRef<string>("")

  // WebRTC Audio Session Hook
  const {
    status,
    isSessionActive,
    registerFunction,
    handleStartStopClick: originalStartStopClick,
    msgs,
    conversation,
    sendTextMessage
  } = useWebRTCAudioSession(voice, tools)

  // Get all tools functions
  const toolsFunctions = useToolsFunctions();

  // Track speaking state based on raw WebRTC messages
  useEffect(() => {
    if (!msgs || msgs.length === 0) return;
    
    // Get the most recent message
    const latestMsg = msgs[msgs.length - 1];
    
    // Avoid processing the same message multiple times
    if (latestMsg.id && latestMsg.id === lastMsgIdRef.current) {
      return;
    }
    
    // Update the last processed message ID
    if (latestMsg.id) {
      lastMsgIdRef.current = latestMsg.id;
    }
    
    // Track speaking state based on message type
    if (latestMsg.type === "response.audio_transcript.delta") {
      // Bot is speaking when we receive transcript deltas
      if (!isBotSpeaking) {
        console.log("Bot started speaking (from message event)");
        setIsBotSpeaking(true);
      }
    } 
    else if (latestMsg.type === "response.audio_transcript.done") {
      // Bot finished speaking when transcript is done
      console.log("Bot finished speaking (from message event)");
      setTimeout(() => {
        setIsBotSpeaking(false);
      }, 500); // Short delay for smooth transition
    }
    else if (latestMsg.type === "input_audio_buffer.speech_started" && isBotSpeaking) {
      // User started speaking, so bot should stop
      console.log("User started speaking, bot should stop");
      setIsBotSpeaking(false);
    }
  }, [msgs, isBotSpeaking]);

  useEffect(() => {
    // Register all functions by iterating over the object
    Object.entries(toolsFunctions).forEach(([name, func]) => {
      const functionNames: Record<string, string> = {
        timeFunction: 'getCurrentTime',
        backgroundFunction: 'changeBackgroundColor',
        partyFunction: 'partyMode',
        launchWebsite: 'launchWebsite', 
        copyToClipboard: 'copyToClipboard',
        scrapeWebsite: 'scrapeWebsite',
        saveInterviewFeedback: 'saveInterviewFeedback'
      };
      
      registerFunction(functionNames[name], func);
    });
  }, [registerFunction, toolsFunctions])

  const handleStartStopClick = async () => {
    if (!isSessionActive) {
      try {
        // Send interview configuration to the API
        await fetch('http://localhost:5000/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            interviewType,
            position: customPosition || position,
          }),
        });
        
        setInterviewStarted(true);
      } catch (error) {
        console.error("Failed to configure interview:", error);
      }
    } else {
      setInterviewStarted(false);
    }
    
    originalStartStopClick();
  }

  return (
    <main className="h-full">
      <motion.div 
        className="container flex flex-col items-center justify-center mx-auto max-w-3xl my-20 p-12 border rounded-lg shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Welcome />
        
        {interviewStarted && isSessionActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-full mb-6"
          >
            <VideoPlayer isBotSpeaking={isBotSpeaking} />
            <div className="flex justify-center mt-2 text-sm text-muted-foreground">
              <span className="flex items-center">
                <span 
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${isBotSpeaking ? "bg-green-500" : "bg-blue-500"}`}
                ></span>
                {isBotSpeaking ? "Interviewer is speaking" : "Interviewer is listening"}
              </span>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="w-full max-w-md bg-card text-card-foreground rounded-xl border shadow-sm p-6 space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {!interviewStarted ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Interview Type</label>
                <Select 
                  value={interviewType} 
                  onValueChange={setInterviewType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Interview Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Position</label>
                <Select 
                  value={position} 
                  onValueChange={setPosition}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Developer">Software Developer</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                    <SelectItem value="Custom">Custom Position</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {position === "Custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Position</label>
                  <Input
                    value={customPosition}
                    onChange={(e) => setCustomPosition(e.target.value)}
                    placeholder="Enter job position"
                  />
                </div>
              )}
            </div>
          ) : null}
          
          <VoiceSelector value={voice} onValueChange={setVoice} />
          
          <div className="flex flex-col items-center gap-4">
            <BroadcastButton 
              isSessionActive={isSessionActive} 
              onClick={handleStartStopClick}
            />
          </div>
          
          {msgs.length > 4 && <TokenUsageDisplay messages={msgs} />}
          
          {status && (
            <motion.div 
              className="w-full flex flex-col gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MessageControls conversation={conversation} msgs={msgs} />
              <TextInput 
                onSubmit={sendTextMessage}
                disabled={!isSessionActive}
              />
            </motion.div>
          )}
        </motion.div>
        
        {status && <StatusDisplay status={status} />}
        
        {interviewStarted && isSessionActive && (
          <motion.div
            className="mt-6 p-4 border rounded-lg w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Interview in Progress</h3>
              <p className="text-sm text-gray-500">
                {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview for {customPosition || position}
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm("Are you sure you want to end this interview?")) {
                    handleStartStopClick();
                  }
                }}
              >
                End Interview
              </Button>
            </div>
          </motion.div>
        )}
        
        <div className="mt-6 text-center">
          <Link href="/feedback">
            <Button variant="ghost" size="sm">
              View Past Feedback
            </Button>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

export default App;