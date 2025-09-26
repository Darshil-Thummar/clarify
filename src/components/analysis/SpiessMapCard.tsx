import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Eye, Heart, Lightbulb, BookOpen, Wrench } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SpiessMapData {
  sensations: string[];
  patterns: string[];
  interpretations: string[];
  emotions: string[];
  stories: string[];
  solutions: string[];
}

interface SpiessMapCardProps {
  data: SpiessMapData;
}

export const SpiessMapCard = ({ data }: SpiessMapCardProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      key: 'sensations',
      label: 'Sensations',
      icon: Eye,
      color: 'text-clarify-primary',
      bgColor: 'bg-clarify-primary/10',
      borderColor: 'border-clarify-primary/20',
      items: data.sensations,
      description: "Physical sensations in your body"
    },
    {
      key: 'patterns',
      label: 'Patterns',
      icon: Network,
      color: 'text-clarify-secondary',
      bgColor: 'bg-clarify-secondary/10',
      borderColor: 'border-clarify-secondary/20',
      items: data.patterns,
      description: "Recurring behavioral and thought patterns"
    },
    {
      key: 'interpretations',
      label: 'Interpretations',
      icon: Lightbulb,
      color: 'text-clarify-accent',
      bgColor: 'bg-clarify-accent/10',
      borderColor: 'border-clarify-accent/20',
      items: data.interpretations,
      description: "How you make meaning of experiences"
    },
    {
      key: 'emotions',
      label: 'Emotions',
      icon: Heart,
      color: 'text-clarify-warning',
      bgColor: 'bg-clarify-warning/10',
      borderColor: 'border-clarify-warning/20',
      items: data.emotions,
      description: "Emotional responses and feelings"
    },
    {
      key: 'stories',
      label: 'Stories',
      icon: BookOpen,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
      items: data.stories,
      description: "Narratives and beliefs about yourself"
    },
    {
      key: 'solutions',
      label: 'Solutions',
      icon: Wrench,
      color: 'text-clarify-success',
      bgColor: 'bg-clarify-success/10',
      borderColor: 'border-clarify-success/20',
      items: data.solutions,
      description: "Potential interventions and strategies"
    }
  ];

  return (
    <Card className="animate-slide-up shadow-card border-clarify-secondary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center shadow-medium">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">SPIESS Map</CardTitle>
            <p className="text-clarify-neutral">Interactive psychological component analysis</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Visual Network */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.key;
              
              return (
                <div
                  key={category.key}
                  className={cn(
                    "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300",
                    "hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1",
                    category.bgColor,
                    category.borderColor,
                    isSelected && "ring-2 ring-primary/40 scale-[1.02] shadow-lg -translate-y-1"
                  )}
                  onClick={() => setSelectedCategory(isSelected ? null : category.key)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      category.bgColor,
                      "border border-current/20"
                    )}>
                      <Icon className={cn("h-5 w-5", category.color)} />
                    </div>
                    <div>
                      <h4 className={cn("font-semibold text-base", category.color)}>{category.label}</h4>
                      <p className="text-xs text-muted-foreground">{category.items.length} items</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {category.items.slice(0, 3).map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center gap-2 p-2 bg-card/50 rounded-md border border-current/10"
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          category.color.replace('text-', 'bg-')
                        )} />
                        <span className="text-xs text-foreground truncate">{item}</span>
                      </div>
                    ))}
                    {category.items.length > 3 && (
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          category.color.replace('text-', 'bg-')
                        )} />
                        <span className="text-xs text-muted-foreground">
                          +{category.items.length - 3} more items
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed View */}
        {selectedCategory && (
          <div className="animate-fade-in">
            {categories
              .filter(cat => cat.key === selectedCategory)
              .map(category => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.key}
                    className={cn(
                      "p-8 rounded-xl border-2 shadow-lg",
                      category.bgColor,
                      category.borderColor
                    )}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        category.bgColor,
                        "border border-current/20 shadow-md"
                      )}>
                        <Icon className={cn("h-6 w-6", category.color)} />
                      </div>
                      <div>
                        <h4 className={cn("text-xl font-bold", category.color)}>
                          {category.label}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      {category.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-card/80 rounded-lg shadow-sm border border-current/10 hover:shadow-md transition-shadow"
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-full flex-shrink-0",
                            category.color.replace('text-', 'bg-')
                          )} />
                          <span className="text-sm text-foreground font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <Badge variant="secondary" className="text-xs">
            Interactive Map Generated
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Map
            </Button>
            <Button variant="outline" size="sm">
              Share Results
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};