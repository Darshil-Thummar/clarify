// Analysis Types & Schemas for Narrative Loop Analysis Platform

export interface UserInput {
  trigger?: string;
  fear?: string;
  emotion?: string;
  outcome?: string;
  rawInput: string;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  field: keyof UserInput;
  answered?: boolean;
  answer?: string;
}

export interface NarrativeLoopStep {
  trigger: string;
  reaction: string;
  consequence: string;
  interpretation: string;
  emotion: string;
  behavior: string;
  whyItFeelsReal: string;
  hiddenLogic: string;
  breakingPoints: string[];
}

export interface SpiessMapData {
  sensations: string[];
  patterns: string[];
  interpretations: string[];
  emotions: string[];
  stories: string[];
  solutions: string[];
  needs: 'security' | 'connection' | 'autonomy' | 'competence' | 'meaning';
  microTest: {
    description: string;
    timeframe: string;
    successCriteria: string;
  };
  toolAction: {
    name: string;
    steps: string[];
    duration: string;
  };
}

export interface AnalysisSummary {
  keyInsight: string;
  mechanism: string;
  breakingPoints: string[];
  nextStep: string;
  wordCount: number;
}

export interface AnalysisSession {
  id: string;
  serverSessionId?: string;
  userInput: UserInput;
  clarifyingQuestions: ClarifyingQuestion[];
  narrativeLoop?: NarrativeLoopStep;
  spiessMap?: SpiessMapData;
  summary?: AnalysisSummary;
  stage: 'input' | 'clarifying' | 'narrative-loop' | 'spiess-map' | 'summary' | 'complete';
  settings: {
    storageOptIn: boolean;
    redactNames: boolean;
  };
  timestamp: Date;
}

export type AnalysisStage = AnalysisSession['stage'];

export interface AnalysisError {
  type: 'validation' | 'processing' | 'network';
  message: string;
  field?: string;
  repairSuggestion?: string;
}