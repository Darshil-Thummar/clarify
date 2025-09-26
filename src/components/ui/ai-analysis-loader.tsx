import { useEffect, useState } from "react";
import { Brain, MessageCircle, TrendingUp, Lightbulb, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisStage {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const analysisStages: AnalysisStage[] = [
  {
    id: "processing",
    label: "Processing Input",
    icon: MessageCircle,
    description: "Understanding your situation..."
  },
  {
    id: "narrative",
    label: "Extracting Narrative Loop",
    icon: Brain,
    description: "Identifying psychological patterns..."
  },
  {
    id: "mapping",
    label: "Creating SPIESS Map",
    icon: TrendingUp,
    description: "Mapping sensations and solutions..."
  },
  {
    id: "insights",
    label: "Generating Insights",
    icon: Lightbulb,
    description: "Preparing actionable recommendations..."
  }
];

interface AIAnalysisLoaderProps {
  active: boolean;
  currentStage?: string;
  className?: string;
  showStages?: boolean;
}

export const AIAnalysisLoader = ({ active, currentStage, className, showStages = true }: AIAnalysisLoaderProps) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!active) {
      setCurrentStageIndex(0);
      setCompletedStages(new Set());
      return;
    }

    // Find the current stage index
    const stageIndex = analysisStages.findIndex(stage => stage.id === currentStage);
    if (stageIndex !== -1) {
      setCurrentStageIndex(stageIndex);
    }

    // Mark previous stages as completed
    const completed = new Set<string>();
    for (let i = 0; i < stageIndex; i++) {
      completed.add(analysisStages[i].id);
    }
    setCompletedStages(completed);
  }, [active, currentStage]);

  if (!active) return null;

  // Simple loader for when showStages is false
  if (!showStages) {
    return (
      <div className={cn(
        "w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-card to-clarify-primary/5",
        "border border-clarify-primary/20 rounded-2xl shadow-strong",
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
        className
      )}>
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-strong animate-breathe">
              <Brain className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-clarify-success rounded-full flex items-center justify-center animate-glow">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              AI Analysis in Progress
            </h3>
            <p className="text-clarify-neutral text-sm">
              {currentStage === 'answers' ? 'Processing your answers...' : 'Analyzing your input...'}
            </p>
          </div>
          <div className="w-8 h-8 border-2 border-clarify-primary/30 border-t-clarify-primary rounded-full animate-spin" />
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-clarify-primary to-clarify-accent rounded-full animate-pulse" 
               style={{ 
                 width: '60%',
                 animation: 'pulse 2s ease-in-out infinite'
               }} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-card to-clarify-primary/5",
      "border border-clarify-primary/20 rounded-2xl shadow-strong",
      "animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
      className
    )}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-strong animate-breathe">
            <Brain className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-clarify-success rounded-full flex items-center justify-center animate-glow">
            <div className="w-3 h-3 bg-white rounded-full animate-ping" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          AI Analysis in Progress
        </h3>
        <p className="text-clarify-neutral text-sm">
          Analyzing your input with advanced psychological frameworks
        </p>
      </div>

      {/* Progress Stages */}
      <div className="space-y-4">
        {analysisStages.map((stage, index) => {
          const isActive = index === currentStageIndex;
          const isCompleted = completedStages.has(stage.id);
          const isUpcoming = index > currentStageIndex;
          
          const IconComponent = stage.icon;
          
          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl transition-all duration-500",
                "border-2",
                isActive && "border-clarify-primary/30 bg-clarify-primary/5 shadow-medium",
                isCompleted && "border-clarify-success/30 bg-clarify-success/5",
                isUpcoming && "border-muted/30 bg-muted/5"
              )}
            >
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                "border-2",
                isActive && "border-clarify-primary bg-clarify-primary/10 shadow-medium",
                isCompleted && "border-clarify-success bg-clarify-success/10",
                isUpcoming && "border-muted bg-muted/10"
              )}>
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-clarify-success" />
                ) : (
                  <IconComponent className={cn(
                    "h-6 w-6 transition-colors duration-500",
                    isActive && "text-clarify-primary animate-pulse",
                    isUpcoming && "text-muted-foreground"
                  )} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className={cn(
                    "font-semibold transition-colors duration-500",
                    isActive && "text-clarify-primary",
                    isCompleted && "text-clarify-success",
                    isUpcoming && "text-muted-foreground"
                  )}>
                    {stage.label}
                  </h4>
                  {isActive && (
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-clarify-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-clarify-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-clarify-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
                <p className={cn(
                  "text-sm transition-colors duration-500",
                  isActive && "text-foreground",
                  isCompleted && "text-clarify-success/80",
                  isUpcoming && "text-muted-foreground"
                )}>
                  {stage.description}
                </p>
              </div>

              {/* Progress indicator */}
              {isActive && (
                <div className="w-8 h-8">
                  <div className="w-8 h-8 border-2 border-clarify-primary/30 border-t-clarify-primary rounded-full animate-spin" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom message */}
      <div className="mt-6 p-4 bg-clarify-primary/5 border border-clarify-primary/20 rounded-xl">
        <p className="text-center text-sm text-clarify-neutral">
          <span className="inline-block w-2 h-2 bg-clarify-primary rounded-full animate-pulse mr-2" />
          This usually takes 10-30 seconds. Please don't close this window.
        </p>
      </div>
    </div>
  );
};
