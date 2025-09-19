import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, ExternalLink, Download } from "lucide-react";

interface SummaryData {
  keyInsight: string;
  breakingPoints: string[];
  recommendedTools: string[];
  nextSteps: string[];
}

interface SummaryCardProps {
  data: SummaryData;
}

export const SummaryCard = ({ data }: SummaryCardProps) => {
  return (
    <Card className="animate-slide-up shadow-strong border-psychology-success/20 bg-gradient-to-br from-card to-psychology-success/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-psychology-success rounded-lg flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Analysis Summary</CardTitle>
            <p className="text-sm text-muted-foreground">Complete psychological pattern breakdown with actionable insights</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Insight */}
        <div className="p-4 bg-psychology-success/10 border border-psychology-success/20 rounded-lg">
          <h4 className="font-semibold text-psychology-success mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Key Insight
          </h4>
          <p className="text-foreground">{data.keyInsight}</p>
        </div>

        {/* Breaking Points */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-psychology-warning" />
            Breaking Points
          </h4>
          <div className="space-y-2">
            {data.breakingPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Badge variant="outline" className="mt-0.5 text-xs">
                  {index + 1}
                </Badge>
                <p className="text-sm text-foreground flex-1">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Tools */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Recommended Tools & Approaches</h4>
          <div className="grid gap-2">
            {data.recommendedTools.map((tool, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-soft hover:shadow-medium transition-shadow">
                <span className="text-sm text-foreground">{tool}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Immediate Next Steps</h4>
          <div className="space-y-3">
            {data.nextSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-psychology-primary/5 border border-psychology-primary/10 rounded-lg">
                <div className="w-6 h-6 bg-psychology-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground flex-1">{step}</p>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button className="bg-gradient-primary hover:opacity-90">
            Start Implementation
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline">
            Schedule Follow-up
          </Button>
          <Button variant="outline">
            Share with Therapist
          </Button>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t text-xs text-muted-foreground">
          <span>Analysis completed in 3 stages</span>
          <Badge variant="secondary">
            Ready for Action
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};