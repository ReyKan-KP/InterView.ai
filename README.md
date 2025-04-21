# interview.ai
A powerful AI-driven interview preparation platform that helps candidates practice and improve their interview skills. Built with Next.js and modern web technologies, interview.ai provides realistic interview simulations with detailed feedback and analytics.


## Features
- **AI-Powered Interviews**: Realistic interview simulations with advanced natural language processing
- **Industry-Specific Questions**: Tailored questions for different industries and job roles
- **Real-time Feedback**: Instant analysis of your responses with improvement suggestions
- **Response Analysis**: Evaluation of communication skills, technical accuracy, and confidence
- **Interview Recording**: Save and review your practice interviews
- **Progress Tracking**: Monitor your improvement over time with detailed analytics
- **Modern UI**: Clean, responsive interface built with Next.js, Tailwind CSS & shadcn/ui
- **Type Safety**: Full TypeScript implementation for reliability

## Requirements
- Node.js 18.x or higher
- OpenAI API Key in `.env` file

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ReyKan-KP/InterView.ai
cd interview.ai
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your-openai-api-key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage
1. Create an account or login
2. Select your industry and job role
3. Choose the type of interview you want to practice
4. Start the interview session
5. Receive feedback and analysis after completion
6. Review your progress in the dashboard


## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements
- [OpenAI](https://openai.com/) for their API and models
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
