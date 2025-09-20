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
    <Card className="animate-scale-in border-clarify-primary/20 shadow-card bg-gradient-to-br from-card to-clarify-primary/5">
      <CardContent className="p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-strong">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Welcome to Clarify
          </h2>
          <p className="text-clarify-neutral text-lg leading-relaxed max-w-2xl mx-auto">
            I'm your step-by-step thinking partner. I'll help you understand the psychological patterns 
            that shape your experiences through a structured analysis: Narrative Loop extraction, 
            SPIESS mapping, and actionable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="text-center group">
            <div className="w-16 h-16 bg-clarify-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-clarify-secondary/30 transition-all duration-300 hover:scale-105 shadow-card">
              <MessageCircle className="h-8 w-8 text-clarify-secondary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-lg">Narrative Loop</h3>
            <p className="text-clarify-neutral">Extract the 6-step psychological pattern</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-clarify-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-clarify-accent/30 transition-all duration-300 hover:scale-105 shadow-card">
              <TrendingUp className="h-8 w-8 text-clarify-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-lg">SPIESS Map</h3>
            <p className="text-clarify-neutral">Visualize sensations, patterns, and solutions</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-clarify-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-clarify-warning/30 transition-all duration-300 hover:scale-105 shadow-card">
              <Lightbulb className="h-8 w-8 text-clarify-warning" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-lg">Insights</h3>
            <p className="text-clarify-neutral">Get actionable next steps and tools</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center text-foreground">Quick Start Examples</h3>
          <div className="grid gap-4">
            {quickStartPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left justify-start h-auto p-5 hover:bg-clarify-primary/5 hover:border-clarify-primary/30 transition-all duration-300 hover:shadow-medium hover:scale-[1.02]"
                onClick={() => onQuickStart(prompt)}
              >
                <span className="text-clarify-neutral leading-relaxed">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-clarify-primary/5 border border-clarify-primary/20 rounded-2xl">
          <p className="text-clarify-neutral text-center leading-relaxed">
            💡 <strong>Tip:</strong> Be specific about the situation, your thoughts, 
            feelings, and behaviors for the most accurate analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};