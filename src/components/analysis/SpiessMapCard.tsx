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
      color: 'text-psychology-primary',
      bgColor: 'bg-psychology-primary/10',
      borderColor: 'border-psychology-primary/20',
      items: data.sensations,
      description: "Physical sensations in your body"
    },
    {
      key: 'patterns',
      label: 'Patterns',
      icon: Network,
      color: 'text-psychology-secondary',
      bgColor: 'bg-psychology-secondary/10',
      borderColor: 'border-psychology-secondary/20',
      items: data.patterns,
      description: "Recurring behavioral and thought patterns"
    },
    {
      key: 'interpretations',
      label: 'Interpretations',
      icon: Lightbulb,
      color: 'text-psychology-accent',
      bgColor: 'bg-psychology-accent/10',
      borderColor: 'border-psychology-accent/20',
      items: data.interpretations,
      description: "How you make meaning of experiences"
    },
    {
      key: 'emotions',
      label: 'Emotions',
      icon: Heart,
      color: 'text-psychology-warning',
      bgColor: 'bg-psychology-warning/10',
      borderColor: 'border-psychology-warning/20',
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
      color: 'text-psychology-success',
      bgColor: 'bg-psychology-success/10',
      borderColor: 'border-psychology-success/20',
      items: data.solutions,
      description: "Potential interventions and strategies"
    }
  ];

  return (
    <Card className="animate-slide-up shadow-medium border-psychology-secondary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
            <Network className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">SPIESS Map</CardTitle>
            <p className="text-sm text-muted-foreground">Interactive psychological component analysis</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Visual Network */}
        <div className="relative">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.key;
              
              return (
                <div
                  key={category.key}
                  className={cn(
                    "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                    "hover:scale-105 hover:shadow-medium",
                    category.bgColor,
                    category.borderColor,
                    isSelected && "ring-2 ring-primary/30 scale-105"
                  )}
                  onClick={() => setSelectedCategory(isSelected ? null : category.key)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={cn("h-5 w-5", category.color)} />
                    <h4 className={cn("font-medium", category.color)}>{category.label}</h4>
                  </div>
                  <div className="space-y-1">
                    {category.items.slice(0, 2).map((item, itemIndex) => (
                      <Badge
                        key={itemIndex}
                        variant="secondary"
                        className="text-xs mr-1 mb-1"
                      >
                        {item}
                      </Badge>
                    ))}
                    {category.items.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.items.length - 2} more
                      </Badge>
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
                      "p-6 rounded-lg border",
                      category.bgColor,
                      category.borderColor
                    )}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={cn("h-6 w-6", category.color)} />
                      <div>
                        <h4 className={cn("text-lg font-semibold", category.color)}>
                          {category.label}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {category.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-soft"
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            category.color.replace('text-', 'bg-')
                          )} />
                          <span className="text-sm text-foreground">{item}</span>
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