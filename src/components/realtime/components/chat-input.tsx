import React, { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME } from "../constants";
import { SlashCommandMenu, getFilteredCommands, processSlashCommand } from "./slash-command-menu";
import type { ProcessedCommand } from "./slash-command-menu";
import { ReplyPreview } from "./reply-preview";
import type { SlashCommand } from "./slash-command-menu";
import type { Message } from "@/contexts/socketio";

interface ChatInputProps {
  onSendMessage: (cmd: ProcessedCommand) => void;
  onTyping: () => void;
  placeholder?: string;
  replyTarget?: Message | null;
  onCancelReply?: () => void;
}

const MAX_LENGTH = 500;
const MAX_ROWS = 5;

export const ChatInput = ({ onSendMessage, onTyping, placeholder = "Message", replyTarget, onCancelReply }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (replyTarget) textareaRef.current?.focus();
  }, [replyTarget]);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    const maxHeight = lineHeight * MAX_ROWS;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  const handleSend = () => {
    if (!textareaRef.current?.value) return;
    const raw = textareaRef.current.value.slice(0, MAX_LENGTH).trim();
    textareaRef.current.value = "";
    setShowCommands(false);
    resizeTextarea();

    if (raw === "") return;
    onSendMessage(processSlashCommand(raw));
  };

  const handleCommandSelect = (cmd: SlashCommand) => {
    const el = textareaRef.current;
    if (!el) return;

    if (cmd.name === "/me") {
      el.value = "/me ";
    } else if (cmd.replacement) {
      el.value = cmd.replacement;
    }

    setShowCommands(false);
    setSelectedIndex(0);
    el.focus();
    resizeTextarea();
  };

  const handleChange = () => {
    onTyping();
    resizeTextarea();

    const val = textareaRef.current?.value ?? "";
    // Show command menu when typing starts with / and is on the first line
    const firstLine = val.split("\n")[0];
    if (firstLine.startsWith("/") && !firstLine.includes(" ")) {
      setCommandQuery(firstLine);
      setShowCommands(true);
      setSelectedIndex(0);
    } else {
      setShowCommands(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommands) {
      const filtered = getFilteredCommands(commandQuery);
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
        return;
      }
      if ((e.key === "Tab" || (e.key === "Enter" && !e.shiftKey)) && filtered.length > 0) {
        e.preventDefault();
        handleCommandSelect(filtered[selectedIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowCommands(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("p-4 pt-0", THEME.bg.primary)}>
      {replyTarget && onCancelReply && (
        <ReplyPreview
          username={replyTarget.username}
          content={replyTarget.content}
          onCancel={onCancelReply}
        />
      )}
      <div className={cn("relative rounded-lg p-2.5 flex items-center gap-2", THEME.bg.tertiary, replyTarget && "rounded-t-none")}>
        {showCommands && (
          <SlashCommandMenu
            query={commandQuery}
            selectedIndex={selectedIndex}
            onSelect={handleCommandSelect}
          />
        )}
        <textarea
          ref={textareaRef}
          className={cn(
            "flex-1 bg-transparent border-none outline-none font-medium min-w-0 resize-none leading-5 overflow-hidden p-0 h-5",
            THEME.text.primary, THEME.text.placeholder
          )}
          placeholder={placeholder}
          aria-label={placeholder}
          maxLength={MAX_LENGTH}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <Button
          size="icon"
          variant="ghost"
          className={cn("h-8 w-8 shrink-0", THEME.text.secondary, THEME.bg.itemHover)}
          onClick={handleSend}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
