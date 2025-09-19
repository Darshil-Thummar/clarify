import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageCircle, Lightbulb, TrendingUp } from "lucide-react";

interface WelcomeCardProps {
  onQuickStart: (message: string) => void;
}

export const WelcomeCard = ({ onQuickStart }: WelcomeCardProps) => {
  const quickStartPrompts = [
    "I keep procrastinating on important tasks",
    "I feel anxious before social events",
    "I have trouble saying no to people",
    "I overthink every decision I make"
  ];

  return (
    <Card className="animate-scale-in border-psychology-primary/20 shadow-medium bg-gradient-to-br from-card to-psychology-primary/5">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Welcome to Narrative Loop Analyzer
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            I'll help you understand the psychological patterns that shape your experiences. 
            Share a situation or recurring pattern, and I'll analyze it through three stages: 
            Narrative Loop extraction, SPIESS mapping, and actionable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center group">
            <div className="w-12 h-12 bg-psychology-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-psychology-secondary/30 transition-colors">
              <MessageCircle className="h-6 w-6 text-psychology-secondary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Narrative Loop</h3>
            <p className="text-sm text-muted-foreground">Extract the 6-step psychological pattern</p>
          </div>
          
          <div className="text-center group">
            <div className="w-12 h-12 bg-psychology-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-psychology-accent/30 transition-colors">
              <TrendingUp className="h-6 w-6 text-psychology-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">SPIESS Map</h3>
            <p className="text-sm text-muted-foreground">Visualize sensations, patterns, and solutions</p>
          </div>
          
          <div className="text-center group">
            <div className="w-12 h-12 bg-psychology-warning/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-psychology-warning/30 transition-colors">
              <Lightbulb className="h-6 w-6 text-psychology-warning" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Insights</h3>
            <p className="text-sm text-muted-foreground">Get actionable next steps and tools</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center text-foreground">Quick Start Examples</h3>
          <div className="grid gap-3">
            {quickStartPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 hover:shadow-soft"
                onClick={() => onQuickStart(prompt)}
              >
                <span className="text-sm">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Tip:</strong> Be specific about the situation, your thoughts, 
            feelings, and behaviors for the most accurate analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};