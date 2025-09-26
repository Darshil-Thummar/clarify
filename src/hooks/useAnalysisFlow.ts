import { useState, useCallback } from 'react';
import { AnalysisSession, UserInput, ClarifyingQuestion, AnalysisStage, NarrativeLoopStep, SpiessMapData, AnalysisSummary } from '@/types/analysis';
import { analyze, getAuthToken, submitAnswers, getSessionDetail, getSessionMessages } from '@/lib/api';

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
  const [apiPhase, setApiPhase] = useState<string | null>(null);

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
  }, [processSummary]);

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
  }, [processSpiessMap]);

  // Process initial user input
  const processUserInput = useCallback(async (rawInput: string) => {
    setIsProcessing(true);
    setApiPhase('analyze');

    // Always store raw input immediately
    const baseInput: UserInput = { rawInput };

    try {
      const token = getAuthToken();
      const response = await analyze({
        input: rawInput,
        storageOptIn: !!token,
        redactNames: true,
      });

      // Map questions (string[]) to our ClarifyingQuestion[] shape
      const mappedQuestions: ClarifyingQuestion[] = (response.questions || []).map((q, index) => ({
        id: `q${index + 1}`,
        question: q,
        field: 'rawInput',
      }));

      // Determine next stage
      const nextStage: AnalysisStage = response.needsAnswers
        ? 'clarifying'
        : 'narrative-loop';

      setSession(prev => ({
        ...prev,
        userInput: baseInput,
        clarifyingQuestions: mappedQuestions,
        stage: nextStage,
        serverSessionId: response.sessionId,
      }));

      setIsProcessing(false);
      setApiPhase(null);

      if (!response.needsAnswers) {
        // Continue with local pipeline using existing mock logic
        setTimeout(() => processNarrativeLoop(baseInput), 500);
      }
      return;
    } catch {
      // Fallback to existing local clarification logic if API fails
      const extractedInput: UserInput = {
        rawInput,
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
      setApiPhase(null);

      if (questions.length === 0) {
        setTimeout(() => processNarrativeLoop(extractedInput), 1000);
      }
    }
  }, [needsClarification, processNarrativeLoop]);

  // Process clarifying question answers
  const processClarifyingAnswers = useCallback(async (answers: Record<string, string>) => {
    setIsProcessing(true);
    setApiPhase('answers');
    
    // Merge answers into user input
    const updatedInput: UserInput = { ...session.userInput };
    
    session.clarifyingQuestions.forEach(question => {
      if (answers[question.id]) {
        // Avoid overwriting raw input when backend questions are generic
        if (question.field !== 'rawInput') {
          updatedInput[question.field] = answers[question.id];
        }
      }
    });

    // If we have a backend session, submit answers and use API response
    if (session.serverSessionId) {
      const orderedAnswers = session.clarifyingQuestions
        .map(q => answers[q.id])
        .filter((v): v is string => typeof v === 'string' && v.trim().length > 0);

      if (orderedAnswers.length > 0) {
        try {
          // Keep processing state true during API call
          const response = await submitAnswers({ 
            sessionId: session.serverSessionId, 
            answers: orderedAnswers 
          });

          // Map API response to session structure
          if (response.narrativeLoop) {
            const apiNarrativeLoop = response.narrativeLoop as any;
            const narrativeLoop: NarrativeLoopStep = {
              trigger: apiNarrativeLoop.trigger || '',
              reaction: apiNarrativeLoop.fear || '',
              consequence: apiNarrativeLoop.outcome || '',
              interpretation: apiNarrativeLoop.hiddenLogic || '',
              emotion: apiNarrativeLoop.emotion || '',
              behavior: apiNarrativeLoop.breakingActions?.join(', ') || '',
              whyItFeelsReal: apiNarrativeLoop.whyItFeelsReal || '',
              hiddenLogic: apiNarrativeLoop.hiddenLogic || '',
              breakingPoints: apiNarrativeLoop.breakingActions || []
            };

            setSession(prev => ({
              ...prev,
              userInput: updatedInput,
              narrativeLoop,
              stage: 'spiess-map',
            }));

            // Process SPIESS map if available
            if (response.spiessMap) {
              const apiSpiessMap = response.spiessMap as any;
              const spiessMap: SpiessMapData = {
                sensations: apiSpiessMap.sensations || [],
                patterns: apiSpiessMap.mechanisms || [],
                interpretations: [apiSpiessMap.confirmationBias || ''],
                emotions: apiSpiessMap.emotions || [],
                stories: [apiSpiessMap.confirmationBias || ''],
                solutions: apiSpiessMap.toolAction?.steps || [],
                needs: 'security', // Default, could be mapped from API
                microTest: {
                  description: apiSpiessMap.microTest?.description || '',
                  timeframe: apiSpiessMap.microTest?.timeframe || '',
                  successCriteria: apiSpiessMap.microTest?.successCriteria || ''
                },
                toolAction: {
                  name: apiSpiessMap.toolAction?.protocol || '',
                  steps: apiSpiessMap.toolAction?.steps || [],
                  duration: 'Ongoing'
                }
              };

              setSession(prev => ({
                ...prev,
                spiessMap,
                stage: 'summary',
              }));

              // Process summary if available
              if (response.summary) {
                const apiSummary = response.summary as any;
                const summary: AnalysisSummary = {
                  keyInsight: apiSummary.content || '',
                  mechanism: apiSummary.mechanisms?.join(', ') || '',
                  breakingPoints: apiSummary.mechanisms || [],
                  nextStep: apiSummary.nextStep || '',
                  wordCount: (apiSummary.content || '').split(' ').length
                };

                setSession(prev => ({
                  ...prev,
                  summary,
                  stage: 'complete',
                }));
              }
            }

            setIsProcessing(false);
            setApiPhase(null);
            return;
          }
        } catch (error) {
          console.error('Failed to submit answers:', error);
          // Fall through to local flow
        }
      }
    }

    // Fallback to local flow
    setSession(prev => ({
      ...prev,
      userInput: updatedInput,
      stage: 'narrative-loop',
    }));

    setIsProcessing(false);
    setApiPhase(null);

    // Proceed to narrative loop analysis
    setTimeout(() => processNarrativeLoop(updatedInput), 1000);
  }, [session.userInput, session.clarifyingQuestions, session.serverSessionId]);

  // Skip clarifying questions
  const skipClarifyingQuestions = useCallback(() => {
    setSession(prev => ({
      ...prev,
      stage: 'narrative-loop',
    }));
    
    setTimeout(() => processNarrativeLoop(session.userInput), 1000);
  }, [session.userInput]);

  // (moved earlier)

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

  // Load an existing server session and its history
  const loadServerSession = useCallback(async (serverId: string) => {
    // Fetch session detail and messages in parallel
    const [detail, history] = await Promise.all([
      getSessionDetail(serverId),
      getSessionMessages(serverId),
    ]);

    // Map messages to UI-friendly shape; ChatInterface will add ids/types
    const mapped = (history.messages || []).map(m => ({
      id: m._id,
      type: m.sender === 'human' ? 'user' : m.sender === 'openai' ? 'ai' : 'system',
      content: m.message || '',
      timestamp: new Date(m.createdAt),
    }));

    // Update local session meta based on server state
    const rawInput = detail?.session?.input || '';
    setSession(prev => ({
      ...prev,
      id: serverId,
      serverSessionId: serverId,
      userInput: { rawInput },
      // Do not change stage here; UI renders history + cards based on messages
    }));

    return { messages: mapped } as const;
  }, []);

  return {
    session,
    isProcessing,
    apiPhase,
    processUserInput,
    processClarifyingAnswers,
    skipClarifyingQuestions,
    updateSettings,
    deleteSession,
    startNewAnalysis,
    loadServerSession,
  };
};