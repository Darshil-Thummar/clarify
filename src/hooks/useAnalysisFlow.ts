import { useState, useCallback } from 'react';
import { AnalysisSession, UserInput, ClarifyingQuestion, AnalysisStage, NarrativeLoopStep, SpiessMapData, AnalysisSummary } from '@/types/analysis';

export const useAnalysisFlow = () => {
  const [session, setSession] = useState<AnalysisSession>({
    id: Date.now().toString(),
    userInput: { rawInput: '' },
    clarifyingQuestions: [],
    stage: 'input',
    settings: {
      storageOptIn: false,
      redactNames: true,
    },
    timestamp: new Date(),
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Helper function to check if input needs clarification
  const needsClarification = useCallback((input: UserInput): ClarifyingQuestion[] => {
    const questions: ClarifyingQuestion[] = [];
    
    if (!input.trigger) {
      questions.push({
        id: 'trigger',
        question: "What specific situation or event triggered this pattern?",
        field: 'trigger',
      });
    }
    
    if (!input.fear) {
      questions.push({
        id: 'fear',
        question: "What are you most afraid might happen in this situation?",
        field: 'fear',
      });
    }
    
    if (!input.emotion) {
      questions.push({
        id: 'emotion',
        question: "What emotions do you typically feel when this happens?",
        field: 'emotion',
      });
    }
    
    if (!input.outcome) {
      questions.push({
        id: 'outcome',
        question: "How do you usually respond or what typically happens next?",
        field: 'outcome',
      });
    }
    
    return questions.slice(0, 3); // Max 3 questions
  }, []);

  // Process initial user input
  const processUserInput = useCallback(async (rawInput: string) => {
    setIsProcessing(true);
    
    // Simple extraction from raw input (in real app, this would use AI)
    const extractedInput: UserInput = {
      rawInput,
      // Mock extraction - in production this would be AI-powered
      trigger: rawInput.includes('work') || rawInput.includes('deadline') ? 'Work deadline pressure' : undefined,
      fear: rawInput.includes('fail') || rawInput.includes('not good enough') ? 'Fear of failure' : undefined,
      emotion: rawInput.includes('anxious') || rawInput.includes('worried') ? 'Anxiety' : undefined,
      outcome: rawInput.includes('avoid') || rawInput.includes('procrastinate') ? 'Avoidance behavior' : undefined,
    };

    const questions = needsClarification(extractedInput);
    
    setSession(prev => ({
      ...prev,
      userInput: extractedInput,
      clarifyingQuestions: questions,
      stage: questions.length > 0 ? 'clarifying' : 'narrative-loop',
    }));

    setIsProcessing(false);

    // If no clarification needed, proceed to analysis
    if (questions.length === 0) {
      setTimeout(() => processNarrativeLoop(extractedInput), 1000);
    }
  }, [needsClarification]);

  // Process clarifying question answers
  const processClarifyingAnswers = useCallback(async (answers: Record<string, string>) => {
    setIsProcessing(true);
    
    // Merge answers into user input
    const updatedInput: UserInput = { ...session.userInput };
    
    session.clarifyingQuestions.forEach(question => {
      if (answers[question.id]) {
        updatedInput[question.field] = answers[question.id];
      }
    });

    setSession(prev => ({
      ...prev,
      userInput: updatedInput,
      stage: 'narrative-loop',
    }));

    setIsProcessing(false);

    // Proceed to narrative loop analysis
    setTimeout(() => processNarrativeLoop(updatedInput), 1000);
  }, [session.userInput, session.clarifyingQuestions]);

  // Skip clarifying questions
  const skipClarifyingQuestions = useCallback(() => {
    setSession(prev => ({
      ...prev,
      stage: 'narrative-loop',
    }));
    
    setTimeout(() => processNarrativeLoop(session.userInput), 1000);
  }, [session.userInput]);

  // Process Narrative Loop Analysis
  const processNarrativeLoop = useCallback(async (input: UserInput) => {
    setIsProcessing(true);

    // Mock narrative loop analysis (in production, this would be AI-generated)
    const narrativeLoop: NarrativeLoopStep = {
      trigger: input.trigger || "Feeling overwhelmed by responsibilities",
      reaction: "Immediate stress and mental fog",
      consequence: "Tasks start piling up and feeling more overwhelming",
      interpretation: input.fear || "I'm not capable of handling this level of responsibility",
      emotion: input.emotion || "Anxiety, shame, and feeling overwhelmed",
      behavior: input.outcome || "Avoid tasks completely, leading to more pressure",
      whyItFeelsReal: "Past experiences of struggle make this interpretation feel valid",
      hiddenLogic: "Avoiding protects from immediate discomfort but creates larger problems",
      breakingPoints: [
        "Challenge the interpretation before emotions escalate",
        "Break overwhelming tasks into smaller, manageable steps",
        "Practice self-compassion when facing difficulties"
      ]
    };

    setSession(prev => ({
      ...prev,
      narrativeLoop,
      stage: 'spiess-map',
    }));

    setIsProcessing(false);
    
    // Proceed to SPIESS map
    setTimeout(() => processSpiessMap(narrativeLoop), 2000);
  }, []);

  // Process SPIESS Map
  const processSpiessMap = useCallback(async (narrativeLoop: NarrativeLoopStep) => {
    setIsProcessing(true);

    // Mock SPIESS map generation
    const spiessMap: SpiessMapData = {
      sensations: ["Tight chest", "Racing heart", "Muscle tension", "Shallow breathing"],
      patterns: ["Perfectionism", "All-or-nothing thinking", "Catastrophizing"],
      interpretations: ["I must be perfect or I'm a failure", "If I can't do it perfectly, why try?"],
      emotions: ["Anxiety", "Shame", "Overwhelm", "Frustration"],
      stories: ["I'm not good enough", "Everyone else has it together", "I always mess things up"],
      solutions: ["Cognitive restructuring", "Gradual exposure", "Mindfulness practice"],
      needs: 'competence',
      microTest: {
        description: "Complete one small task for 10 minutes without stopping",
        timeframe: "Next 24 hours",
        successCriteria: "Task completed regardless of quality"
      },
      toolAction: {
        name: "Cognitive Behavioral Therapy (CBT) Fundamentals",
        steps: [
          "Identify the triggering thought",
          "Examine evidence for and against the thought",
          "Generate a balanced, realistic alternative thought",
          "Test the new thought through behavioral experiment"
        ],
        duration: "4-8 weeks with daily practice"
      }
    };

    setSession(prev => ({
      ...prev,
      spiessMap,
      stage: 'summary',
    }));

    setIsProcessing(false);
    
    // Proceed to summary
    setTimeout(() => processSummary(narrativeLoop, spiessMap), 2000);
  }, []);

  // Process Summary
  const processSummary = useCallback(async (narrativeLoop: NarrativeLoopStep, spiessMap: SpiessMapData) => {
    setIsProcessing(true);

    // Generate concise summary (<250 words)
    const summary: AnalysisSummary = {
      keyInsight: "Your narrative loop centers around perfectionism-driven avoidance that reinforces feelings of inadequacy.",
      mechanism: "Perfectionism triggers all-or-nothing thinking, leading to task avoidance when standards feel unachievable. This avoidance confirms the belief 'I'm not capable,' creating a self-reinforcing cycle of anxiety and shame.",
      breakingPoints: [
        "Challenge perfectionist thoughts before they trigger avoidance",
        "Practice self-compassion when facing difficult tasks",
        "Break overwhelming tasks into smaller, manageable steps"
      ],
      nextStep: "Complete the micro-test: work on one small task for 10 minutes today without stopping, regardless of the quality of your work.",
      wordCount: 89
    };

    setSession(prev => ({
      ...prev,
      summary,
      stage: 'complete',
    }));

    setIsProcessing(false);
  }, []);

  // Update privacy settings
  const updateSettings = useCallback((newSettings: Partial<typeof session.settings>) => {
    setSession(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  // Delete session
  const deleteSession = useCallback(() => {
    setSession({
      id: Date.now().toString(),
      userInput: { rawInput: '' },
      clarifyingQuestions: [],
      stage: 'input',
      settings: {
        storageOptIn: false,
        redactNames: true,
      },
      timestamp: new Date(),
    });
  }, []);

  // Reset to start new analysis
  const startNewAnalysis = useCallback(() => {
    deleteSession();
  }, [deleteSession]);

  return {
    session,
    isProcessing,
    processUserInput,
    processClarifyingAnswers,
    skipClarifyingQuestions,
    updateSettings,
    deleteSession,
    startNewAnalysis,
  };
};