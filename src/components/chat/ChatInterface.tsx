import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeCard } from "./WelcomeCard";
import { NarrativeLoopCard } from "../analysis/NarrativeLoopCard";
import { SpiessMapCard } from "../analysis/SpiessMapCard";
import { SummaryCard } from "../analysis/SummaryCard";
import { Button } from "@/components/ui/button";
import { Trash2, Settings } from "lucide-react";

export interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  analysisStage?: 'welcome' | 'narrative-loop' | 'spiess-map' | 'summary';
  analysisData?: any;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Narrative Loop Analyzer',
      timestamp: new Date(),
      analysisStage: 'welcome'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I understand you'd like me to analyze that pattern. Let me process your input and extract the narrative loop...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Add analysis stages
      setTimeout(() => {
        const narrativeMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'system',
          content: 'Narrative Loop Analysis Complete',
          timestamp: new Date(),
          analysisStage: 'narrative-loop',
          analysisData: {
            trigger: "Feeling overwhelmed by deadlines",
            reaction: "Procrastination kicks in",
            consequence: "Tasks pile up even more",
            interpretation: "I'm not capable of handling this",
            emotion: "Anxiety and shame spiral",
            behavior: "Avoid responsibilities completely"
          }
        };
        setMessages(prev => [...prev, narrativeMessage]);
      }, 2000);

      setTimeout(() => {
        const spiessMessage: Message = {
          id: (Date.now() + 3).toString(),
          type: 'system',
          content: 'SPIESS Map Generated',
          timestamp: new Date(),
          analysisStage: 'spiess-map',
          analysisData: {
            sensations: ["Tight chest", "Racing heart", "Tension in shoulders"],
            patterns: ["Perfectionism", "All-or-nothing thinking"],
            interpretations: ["I must be perfect or I'm a failure"],
            emotions: ["Anxiety", "Shame", "Overwhelm"],
            stories: ["I'm not good enough", "Everyone else has it together"],
            solutions: ["Gradual exposure therapy", "Mindfulness practices", "Time management skills"]
          }
        };
        setMessages(prev => [...prev, spiessMessage]);
      }, 4000);

      setTimeout(() => {
        const summaryMessage: Message = {
          id: (Date.now() + 4).toString(),
          type: 'system',
          content: 'Analysis Summary Ready',
          timestamp: new Date(),
          analysisStage: 'summary',
          analysisData: {
            keyInsight: "Your narrative loop centers around perfectionism and avoidance",
            breakingPoints: ["Challenge all-or-nothing thoughts", "Practice self-compassion", "Break tasks into smaller steps"],
            recommendedTools: ["Cognitive Behavioral Therapy", "Mindfulness-Based Stress Reduction", "Pomodoro Technique"],
            nextSteps: ["Start with 5-minute focused work sessions", "Practice daily self-compassion", "Schedule regular breaks"]
          }
        };
        setMessages(prev => [...prev, summaryMessage]);
      }, 6000);
    }, 1500);
  };

  const handleClearChat = () => {
    setMessages([{
      id: '1',
      type: 'system',
      content: 'Welcome to Narrative Loop Analyzer',
      timestamp: new Date(),
      analysisStage: 'welcome'
    }]);
  };

  const renderSpecialMessage = (message: Message) => {
    switch (message.analysisStage) {
      case 'welcome':
        return <WelcomeCard onQuickStart={handleSendMessage} />;
      case 'narrative-loop':
        return <NarrativeLoopCard data={message.analysisData} />;
      case 'spiess-map':
        return <SpiessMapCard data={message.analysisData} />;
      case 'summary':
        return <SummaryCard data={message.analysisData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Narrative Loop Analyzer</h1>
          <p className="text-sm text-muted-foreground">Psychological Pattern Analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleClearChat}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="animate-fade-in">
              {message.analysisStage ? (
                renderSpecialMessage(message)
              ) : (
                <MessageBubble message={message} />
              )}
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card shadow-soft">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};