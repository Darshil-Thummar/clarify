import { Bot } from "lucide-react";

interface TypingIndicatorProps {
  message?: string;
}

export const TypingIndicator = ({ message = "AI is analyzing" }: TypingIndicatorProps) => {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ai-message flex items-center justify-center">
        <Bot className="h-4 w-4 text-ai-message-foreground" />
      </div>

      {/* Typing bubble */}
      <div className="bg-ai-message text-ai-message-foreground px-4 py-3 rounded-lg shadow-soft max-w-[200px]">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">{message}</span>
          <div className="flex gap-1 ml-2">
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse-typing" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse-typing" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse-typing" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};