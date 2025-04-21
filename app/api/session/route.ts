import { NextResponse } from 'next/server';
let interviewType = "";
let position = "";
export async function POST(request: Request) {
    try {        
        if (!process.env.OPENAI_API_KEY){
            throw new Error(`OPENAI_API_KEY is not set`);
        }

        // Get request data if available, otherwise use defaults
        
        
        try {
            const requestData = await request.json();
            interviewType = requestData.interviewType || interviewType;
            position = requestData.position || position;
        } catch (e) {
            // If parsing fails, use defaults
            console.log("Using default interview settings");
        }
        
        // Call OpenAI to create a session
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: "alloy",
                modalities: ["audio", "text"],
                instructions: `You are an expert interviewer for ${position} positions. Conduct a professional interview for this role, asking relevant technical and behavioral questions. 
                
                Start by introducing yourself as InterView AI and explain that you'll be conducting a ${interviewType} interview for a ${position} position. Ask questions one at a time and wait for complete responses before proceeding to the next question.
                
                Adapt your questions based on the candidate's responses to create a natural interview flow. Provide brief feedback after their answers when appropriate. 
                
                Use the available tools when relevant, especially for technical demonstrations or to record significant feedback. 
                
                End the interview by thanking them for their time and explaining that they'll receive feedback on their performance.`,
                tool_choice: "auto",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        // Format the response correctly with client_secret structure
        return NextResponse.json({
            client_secret: {
                value: data.client_token
            },
            ...data
        });
    } catch (error: any) {
        console.error("Error fetching session data:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch session data" }, { status: 500 });
    }
}