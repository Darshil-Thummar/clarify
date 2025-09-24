import { useRef, useEffect, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeCard } from "./WelcomeCard";
import { NarrativeLoopCard } from "../analysis/NarrativeLoopCard";
import { SpiessMapCard } from "../analysis/SpiessMapCard";
import { SummaryCard } from "../analysis/SummaryCard";
import { ClarifyingQuestions } from "../analysis/ClarifyingQuestions";
import { PrivacyControls } from "../settings/PrivacyControls";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Settings, Shield } from "lucide-react";
import { useAnalysisFlow } from "@/hooks/useAnalysisFlow";
import { getAuthToken, setAuthToken, fetchMe } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";

export interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const navigate = useNavigate();
  const {
    session,
    isProcessing,
    processUserInput,
    processClarifyingAnswers,
    skipClarifyingQuestions,
    updateSettings,
    deleteSession,
    startNewAnalysis,
  } = useAnalysisFlow();

  const token = getAuthToken();
  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => await fetchMe<any>(),
    enabled: !!token,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasPromptedLogin, setHasPromptedLogin] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.stage]);

  // First-visit modal if not authenticated
  useEffect(() => {
    const token = getAuthToken();
    const seenFlag = localStorage.getItem("onboarding_seen");
    if (!token && !seenFlag) {
      setShowOnboarding(true);
      localStorage.setItem("onboarding_seen", "1");
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    const token = getAuthToken();
    if (!token && !hasPromptedLogin) {
      setHasPromptedLogin(true);
      navigate("/login");
      return;
    }
    if (session.stage === 'input') {
      await processUserInput(content);
    }
  };

  const handleClarifyingAnswers = async (answers: Record<string, string>) => {
    await processClarifyingAnswers(answers);
  };

  const handleSkipQuestions = () => {
    skipClarifyingQuestions();
  };

  const handleSettingsChange = (newSettings: Partial<typeof session.settings>) => {
    updateSettings(newSettings);
  };

  const handleDeleteSession = () => {
    deleteSession();
  };

  const getStageDescription = () => {
    switch (session.stage) {
      case 'input':
        return 'Ready to analyze your psychological patterns';
      case 'clarifying':
        return 'Gathering additional details for accurate analysis';
      case 'narrative-loop':
        return 'Extracting your narrative loop pattern...';
      case 'spiess-map':
        return 'Building your SPIESS psychological map...';
      case 'summary':
        return 'Generating your analysis summary...';
      case 'complete':
        return 'Analysis complete - review your results';
      default:
        return 'Psychological Pattern Analysis';
    }
  };

  const renderCurrentStage = () => {
    switch (session.stage) {
      case 'input':
        return <WelcomeCard onQuickStart={handleSendMessage} />;
      
      case 'clarifying':
        return (
          <ClarifyingQuestions
            questions={session.clarifyingQuestions}
            onAnswersSubmit={handleClarifyingAnswers}
            onSkip={handleSkipQuestions}
          />
        );
      
      case 'narrative-loop':
      case 'spiess-map':
      case 'summary':
        return (
          <div className="space-y-6">
            {session.userInput.rawInput && (
              <MessageBubble
                message={{
                  id: 'user-input',
                  type: 'user',
                  content: session.userInput.rawInput,
                  timestamp: session.timestamp
                }}
              />
            )}
            
            {session.stage !== 'narrative-loop' && session.narrativeLoop && (
              <NarrativeLoopCard data={session.narrativeLoop} />
            )}
            
            {session.stage === 'narrative-loop' && isProcessing && (
              <TypingIndicator message="Extracting your narrative loop pattern..." />
            )}
            
            {session.stage === 'narrative-loop' && !isProcessing && session.narrativeLoop && (
              <NarrativeLoopCard data={session.narrativeLoop} />
            )}
            
            {session.stage !== 'spiess-map' && session.spiessMap && (
              <SpiessMapCard data={session.spiessMap} />
            )}
            
            {session.stage === 'spiess-map' && isProcessing && (
              <TypingIndicator message="Building your SPIESS psychological map..." />
            )}
            
            {session.stage === 'spiess-map' && !isProcessing && session.spiessMap && (
              <SpiessMapCard data={session.spiessMap} />
            )}
            
            {session.stage !== 'summary' && session.summary && (
              <SummaryCard data={session.summary} />
            )}
            
            {session.stage === 'summary' && isProcessing && (
              <TypingIndicator message="Generating your analysis summary..." />
            )}
            
            {session.stage === 'summary' && !isProcessing && session.summary && (
              <SummaryCard data={session.summary} />
            )}
          </div>
        );
      
      case 'complete':
        return (
          <div className="space-y-6">
            <MessageBubble
              message={{
                id: 'user-input',
                type: 'user',
                content: session.userInput.rawInput,
                timestamp: session.timestamp
              }}
            />
            {session.narrativeLoop && <NarrativeLoopCard data={session.narrativeLoop} />}
            {session.spiessMap && <SpiessMapCard data={session.spiessMap} />}
            {session.summary && <SummaryCard data={session.summary} />}
            
            <PrivacyControls
              settings={session.settings}
              onSettingsChange={handleSettingsChange}
              onDeleteSession={handleDeleteSession}
              showInline
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      {/* Header */}
      <header 
        className="bg-card border-b shadow-soft px-6 py-4 flex justify-between items-center"
        role="banner"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Clarify</h1>
            <p className="text-sm text-clarify-secondary font-medium">Your Step-by-Step Thinking Partner</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {!token ? (
            <Button
              size="sm"
              onClick={() => navigate("/login")}
            >
              Get started
            </Button>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {userData?.data?.user?.username || userData?.data?.user?.firstName || "User"}
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out of your account. You'll need to sign in again to continue.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setAuthToken(null);
                        window.location.reload();
                      }}
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                aria-label="Privacy and settings"
              >
                <Shield className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Privacy & Settings</DialogTitle>
              </DialogHeader>
              <PrivacyControls
                settings={session.settings}
                onSettingsChange={handleSettingsChange}
                onDeleteSession={handleDeleteSession}
              />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={startNewAnalysis}
            aria-label="Start new analysis session"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main 
        className="flex-1 overflow-y-auto px-4 py-6"
        role="main"
        aria-live="polite"
        aria-label="Analysis interface"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {renderCurrentStage()}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      {session.stage === 'input' && (
        <div className="border-t bg-card shadow-soft" role="complementary">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              disabled={isProcessing}
              placeholder="Describe a recurring pattern or situation you'd like to analyze..."
            />
          </div>
        </div>
      )}

      {/* First-visit Modal */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to Clarify</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Get started by creating an account or logging in.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => { setShowOnboarding(false); navigate("/login"); }}>Login</Button>
            <Button onClick={() => { setShowOnboarding(false); navigate("/register"); }}>Register</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};