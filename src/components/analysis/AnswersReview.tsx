import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Share2, Printer, Mail, Link, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisSession, ClarifyingQuestion } from '@/types/analysis';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnswersReviewProps {
  session: AnalysisSession;
  onClose?: () => void;
}

interface AnswerData {
  question: string;
  userAnswer: string;
  editedAnswer?: string;
  summary: string[];
  followUps?: string[];
  timestamp: Date;
}

export const AnswersReview: React.FC<AnswersReviewProps> = ({ session, onClose }) => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  // Process session data into structured answers
  const processAnswers = (): AnswerData[] => {
    const answers: AnswerData[] = [];
    
    // Add clarifying questions and their answers
    session.clarifyingQuestions.forEach((question, index) => {
      const userAnswer = session.userInput[question.field as keyof typeof session.userInput] || '';
      
      answers.push({
        question: question.question,
        userAnswer: userAnswer,
        editedAnswer: userAnswer, // Could be enhanced with AI editing
        summary: [
          `Key insight: ${userAnswer}`,
          `Pattern identified: ${question.field}`,
          `Analysis stage: ${session.stage}`
        ],
        followUps: [
          'How does this pattern affect your daily life?',
          'What triggers this response most often?',
          'What would you like to change about this pattern?'
        ],
        timestamp: session.timestamp
      });
    });

    return answers;
  };

  const answers = processAnswers();

  const generatePDF = async () => {
    setIsGenerating('pdf');
    try {
      const pdf = new jsPDF();

      const margin = 20;
      const contentWidth = 170;
      const pageHeight = 280;
      let y = 30;

      // Header: Clarify
      const drawHeader = () => {
        pdf.setFillColor(63, 81, 181);
        pdf.rect(0, 0, 210, 30, 'F');
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('Clarify', margin, 20);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(255, 255, 255);
        pdf.text('Psychological Pattern Analysis Report', margin + 50, 20);
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 26);
      };

      drawHeader();

      // Report meta
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text(`Session ID: ${session.id}`, margin, 40);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, 42, 190, 42);
      y = 50;

      const ensureSpace = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight) {
          pdf.addPage();
          drawHeader();
          pdf.setDrawColor(220);
          y = 30;
          pdf.line(margin, y + 8, 190, y + 8);
          y += 18;
        }
      };

      const sectionHeader = (title: string, color: [number, number, number]) => {
        ensureSpace(20);
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.rect(margin, y, 170, 12, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text(title, margin + 6, y + 8);
        y += 18;
        pdf.setTextColor(33, 37, 41);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
      };

      const paragraph = (text: string, isBold = false) => {
        const lines = pdf.splitTextToSize(text, contentWidth);
        ensureSpace(lines.length * 6 + 4);
        if (isBold) {
          pdf.setFont('helvetica', 'bold');
        }
        pdf.text(lines, margin, y);
        if (isBold) {
          pdf.setFont('helvetica', 'normal');
        }
        y += lines.length * 6 + 8;
      };

      const list = (items: string[]) => {
        items.forEach((item) => {
          const lines = pdf.splitTextToSize(`• ${item}`, contentWidth);
          ensureSpace(lines.length * 6 + 2);
          pdf.text(lines, margin, y);
          y += lines.length * 6 + 4;
        });
      };

      // Section: Questions & Answers
      sectionHeader('Questions & Answers', [63, 81, 181]);
      answers.forEach((answer, idx) => {
        ensureSpace(15);
        paragraph(`Question ${idx + 1}`, true);
        paragraph(answer.question);
        y += 2;

        paragraph('Your Answer', true);
        paragraph(answer.userAnswer || '');
        y += 2;

        if (answer.editedAnswer && answer.editedAnswer !== answer.userAnswer) {
          paragraph('Refined Answer', true);
          paragraph(answer.editedAnswer);
          y += 2;
        }

        if (answer.summary?.length) {
          paragraph('Key Points', true);
          list(answer.summary);
          y += 2;
        }

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 100, 100);
        paragraph(`Answered: ${answer.timestamp.toLocaleString()}`);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(33, 37, 41);

        pdf.setDrawColor(220, 220, 220);
        ensureSpace(10);
        pdf.line(margin, y, 190, y);
        y += 12;
      });

      // Section: Narrative Loop
      if (session.narrativeLoop) {
        sectionHeader('Narrative Loop Analysis', [16, 185, 129]);
        paragraph('Trigger Event', true);
        paragraph(session.narrativeLoop.trigger);
        y += 2;

        paragraph('Initial Reaction', true);
        paragraph(session.narrativeLoop.reaction);
        y += 2;

        paragraph('Consequence', true);
        paragraph(session.narrativeLoop.consequence);
        y += 2;

        paragraph('Interpretation', true);
        paragraph(session.narrativeLoop.interpretation);
        y += 2;

        paragraph('Emotional Response', true);
        paragraph(session.narrativeLoop.emotion);
        y += 2;

        paragraph('Behavioral Pattern', true);
        paragraph(session.narrativeLoop.behavior);
        y += 2;

        paragraph('Why It Feels Real', true);
        paragraph(session.narrativeLoop.whyItFeelsReal);
        y += 2;

        paragraph('Hidden Logic', true);
        paragraph(session.narrativeLoop.hiddenLogic);
        y += 2;

        if (session.narrativeLoop.breakingPoints?.length) {
          paragraph('Breaking Points', true);
          list(session.narrativeLoop.breakingPoints);
        }
      }

      // Section: SPIESS Map
      if (session.spiessMap) {
        sectionHeader('SPIESS Psychological Map', [255, 159, 67]);
        
        paragraph('Sensations', true);
        list(session.spiessMap.sensations);
        y += 2;

        paragraph('Patterns', true);
        list(session.spiessMap.patterns);
        y += 2;

        paragraph('Interpretations', true);
        list(session.spiessMap.interpretations);
        y += 2;

        paragraph('Emotions', true);
        list(session.spiessMap.emotions);
        y += 2;

        paragraph('Stories', true);
        list(session.spiessMap.stories);
        y += 2;

        paragraph('Solutions', true);
        list(session.spiessMap.solutions);
        y += 2;

        paragraph('Core Need', true);
        paragraph(session.spiessMap.needs);
        y += 2;

        if (session.spiessMap.microTest) {
          paragraph('Micro Test', true);
          paragraph('Description', true);
          paragraph(session.spiessMap.microTest.description);
          paragraph('Timeframe', true);
          paragraph(session.spiessMap.microTest.timeframe);
          paragraph('Success Criteria', true);
          paragraph(session.spiessMap.microTest.successCriteria);
          y += 2;
        }

        if (session.spiessMap.toolAction) {
          paragraph('Recommended Tool Action', true);
          paragraph('Name', true);
          paragraph(session.spiessMap.toolAction.name);
          if (session.spiessMap.toolAction.steps?.length) {
            paragraph('Steps', true);
            list(session.spiessMap.toolAction.steps);
          }
          if (session.spiessMap.toolAction.duration) {
            paragraph('Duration', true);
            paragraph(session.spiessMap.toolAction.duration);
          }
        }
      }

      // Section: Insights (Summary)
      if (session.summary) {
        sectionHeader('Key Insights & Recommendations', [91, 33, 182]);
        
        paragraph('Key Insight', true);
        paragraph(session.summary.keyInsight);
        y += 2;

        paragraph('Mechanism', true);
        paragraph(session.summary.mechanism);
        y += 2;

        if (session.summary.breakingPoints?.length) {
          paragraph('Breaking Points', true);
          list(session.summary.breakingPoints);
          y += 2;
        }

        if (session.summary.nextStep) {
          paragraph('Recommended Next Step', true);
          paragraph(session.summary.nextStep);
        }
      }

      pdf.save('clarify-analysis-report.pdf');
      
      toast({
        title: "PDF Generated",
        description: "Your analysis report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const generateCSV = async () => {
    setIsGenerating('csv');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const csvContent = [
        'Question,User Answer,Edited Answer,Summary,Timestamp',
        ...answers.map(answer => 
          `"${answer.question}","${answer.userAnswer}","${answer.editedAnswer || ''}","${answer.summary.join('; ')}","${answer.timestamp.toISOString()}"`
        )
      ].join('\n');
      
      const element = document.createElement('a');
      const file = new Blob([csvContent], { type: 'text/csv' });
      element.href = URL.createObjectURL(file);
      element.download = 'clarify-analysis-answers.csv';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "CSV Generated",
        description: "Your answers have been exported to CSV.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate CSV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const generateIndividualPDF = async (answerIndex: number) => {
    setIsGenerating(`individual-${answerIndex}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const answer = answers[answerIndex];
      const element = document.createElement('a');
      const file = new Blob([`Individual answer PDF for: ${answer.question}`], { type: 'application/pdf' });
      element.href = URL.createObjectURL(file);
      element.download = `clarify-answer-${answerIndex + 1}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Individual PDF Generated",
        description: `Answer ${answerIndex + 1} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate individual PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const shareResults = () => {
    const shareData = {
      title: 'Clarify Analysis Results',
      text: `Analysis completed with ${answers.length} questions answered.`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Analysis link has been copied to clipboard.",
      });
    }
  };

  const printResults = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Analysis Answers Review</h1>
        <p className="text-muted-foreground">
          Review your answers and export your analysis results
        </p>
      </div>

      {/* Answers Display */}
      <div className="space-y-6">
        {answers.map((answer, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    Question {index + 1}
                  </Badge>
                  <CardTitle className="text-lg">{answer.question}</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">
                  {answer.timestamp.toLocaleString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Answer */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Your Answer</h4>
                <p className="bg-muted p-3 rounded-md">{answer.userAnswer}</p>
              </div>

              {/* Edited Answer */}
              {answer.editedAnswer && answer.editedAnswer !== answer.userAnswer && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Refined Answer</h4>
                  <p className="bg-blue-50 p-3 rounded-md border-l-2 border-blue-200">
                    {answer.editedAnswer}
                  </p>
                </div>
              )}

              {/* Summary */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Key Points</h4>
                <ul className="space-y-1">
                  {answer.summary.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Follow-ups */}
              {answer.followUps && answer.followUps.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Suggested Follow-ups</h4>
                  <ul className="space-y-1">
                    {answer.followUps.map((followUp, followUpIndex) => (
                      <li key={followUpIndex} className="flex items-start">
                        <span className="text-green-500 mr-2">→</span>
                        <span className="text-sm">{followUp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Export & Share</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Button
              onClick={generatePDF}
              disabled={isGenerating === 'pdf'}
              className="flex items-center gap-2"
            >
              {isGenerating === 'pdf' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {isGenerating === 'pdf' ? 'Generating...' : 'Full Report (PDF)'}
            </Button>

            <Button
              onClick={generateCSV}
              disabled={isGenerating === 'csv'}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isGenerating === 'csv' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGenerating === 'csv' ? 'Generating...' : 'Download CSV'}
            </Button>

            <Button
              onClick={shareResults}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button
              onClick={printResults}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>

            <Button
              onClick={onClose}
              variant="ghost"
              className="flex items-center gap-2"
            >
              Close
            </Button>
          </div>

          {/* Individual Answer Downloads */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Download Individual Answers</h4>
            <div className="flex flex-wrap gap-2">
              {answers.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => generateIndividualPDF(index)}
                  disabled={isGenerating === `individual-${index}`}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isGenerating === `individual-${index}` ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <FileText className="h-3 w-3" />
                  )}
                  Answer {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};