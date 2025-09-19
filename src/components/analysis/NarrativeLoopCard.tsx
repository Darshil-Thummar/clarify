import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NarrativeLoopStep } from "@/types/analysis";

interface NarrativeLoopCardProps {
  data: NarrativeLoopStep;
}

export const NarrativeLoopCard = ({ data }: NarrativeLoopCardProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    { 
      key: 'trigger', 
      label: 'Trigger Event', 
      value: data.trigger, 
      color: 'bg-psychology-warning/20 text-psychology-warning',
      description: "The initial situation or stimulus that starts the loop"
    },
    { 
      key: 'reaction', 
      label: 'Initial Reaction', 
      value: data.reaction, 
      color: 'bg-psychology-accent/20 text-psychology-accent',
      description: "Your immediate response to the trigger"
    },
    { 
      key: 'consequence', 
      label: 'Consequence', 
      value: data.consequence, 
      color: 'bg-destructive/20 text-destructive',
      description: "What happens as a result of your reaction"
    },
    { 
      key: 'interpretation', 
      label: 'Interpretation', 
      value: data.interpretation, 
      color: 'bg-psychology-primary/20 text-psychology-primary',
      description: "How you make sense of what happened"
    },
    { 
      key: 'emotion', 
      label: 'Emotional Response', 
      value: data.emotion, 
      color: 'bg-psychology-secondary/20 text-psychology-secondary',
      description: "The feelings that arise from your interpretation"
    },
    { 
      key: 'behavior', 
      label: 'Behavioral Pattern', 
      value: data.behavior, 
      color: 'bg-muted text-muted-foreground',
      description: "Actions you take based on these emotions"
    }
  ];

  return (
    <Card className="animate-slide-up shadow-medium border-psychology-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Narrative Loop Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">6-step psychological pattern identified</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div key={step.key} className="group">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <Badge variant="outline" className={cn("text-xs font-medium", step.color)}>
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{step.label}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                      >
                        <ChevronDown className={cn(
                          "h-3 w-3 transition-transform",
                          expandedStep === index && "transform rotate-180"
                        )} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.value}</p>
                    {expandedStep === index && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg animate-fade-in">
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-psychology-warning/10 border border-psychology-warning/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-psychology-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Breaking Point Identified</h4>
              <p className="text-sm text-muted-foreground mb-2">
                The strongest intervention opportunity is between steps 3-4: 
                challenging the interpretation before emotions escalate.
              </p>
              <div className="space-y-1">
                {data.breakingPoints.map((point, index) => (
                  <p key={index} className="text-xs text-psychology-warning">• {point}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Badge variant="secondary" className="text-xs">
            Analysis Complete
          </Badge>
          <Button variant="outline" size="sm">
            Export Loop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};