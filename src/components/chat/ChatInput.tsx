import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Paperclip, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSendMessage, disabled, placeholder = "Describe a situation or pattern you'd like to analyze..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1 relative">

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[48px] max-h-32 resize-none pr-20 transition-all duration-200",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "placeholder:text-muted-foreground/60"
          )}
          rows={1}
        />
        
        {/* Attachment and Mic buttons */}
        <div className="absolute right-2 bottom-2 flex gap-1">
          {/*<Button*/}
          {/*  type="button"*/}
          {/*  variant="ghost"*/}
          {/*  size="sm"*/}
          {/*  className="h-8 w-8 p-0 hover:bg-muted/80"*/}
          {/*  disabled={disabled}*/}
          {/*>*/}
          {/*  <Paperclip className="h-4 w-4" />*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  type="button"*/}
          {/*  variant="ghost"*/}
          {/*  size="sm"*/}
          {/*  className="h-8 w-8 p-0 hover:bg-muted/80"*/}
          {/*  disabled={disabled}*/}
          {/*>*/}
          {/*  <Mic className="h-4 w-4" />*/}
          {/*</Button>*/}
        </div>
      </div>

      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        className={cn(
          "h-12 w-12 p-0 bg-gradient-primary hover:opacity-90",
          "transition-all duration-200 hover:scale-105 active:scale-95",
          "shadow-soft hover:shadow-medium",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {disabled ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};