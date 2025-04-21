// Add interface for tools
interface Tool {
    type: 'function';
    name: string;
    description: string;
    parameters?: {
      type: string;
      properties: Record<string, {
        type: string;
        description: string;
      }>;
    };
}

const toolDefinitions = {

    saveInterviewFeedback: {
        description: 'Saves interview feedback for the candidate',
        parameters: {
            strengths: {
                type: 'string',
                description: 'Candidate\'s strengths during the interview'
            },
            weaknesses: {
                type: 'string',
                description: 'Areas for improvement for the candidate'
            },
            overallRating: {
                type: 'string',
                description: 'Overall rating of the interview (e.g., Excellent, Good, Average, Poor)'
            },
            recommendations: {
                type: 'string',
                description: 'Specific recommendations for improvement'
            }
        }
    }
} as const;

const tools: Tool[] = Object.entries(toolDefinitions).map(([name, config]) => ({
    type: "function",
    name,
    description: config.description,
    parameters: {
    type: 'object',
    properties: config.parameters
    }
}));


export type { Tool };
export { tools };