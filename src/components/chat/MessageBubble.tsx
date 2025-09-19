import { Message } from "./ChatInterface";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div className={cn(
      "flex gap-3 group",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser && "bg-user-message",
        !isUser && !isSystem && "bg-ai-message",
        isSystem && "bg-system-message"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-user-message-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-ai-message-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-[70%]",
        isUser && "flex justify-end"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-lg shadow-soft transition-all duration-200 hover:shadow-medium",
          isUser && "bg-user-message text-user-message-foreground",
          !isUser && !isSystem && "bg-ai-message text-ai-message-foreground",
          isSystem && "bg-system-message text-system-message-foreground border border-psychology-warning/20"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser && "text-user-message-foreground",
            !isUser && "text-ai-message-foreground"
          )}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};