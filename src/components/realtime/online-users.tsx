"use client";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

import { SocketContext } from "@/contexts/socketio";
import { Users, Users2, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

import { useChatScroll } from "./hooks/use-chat-scroll";
import { useTyping } from "./hooks/use-typing";
import { ChatMessageList } from "./components/chat-message-list";
import { ChatInput } from "./components/chat-input";
import { UserList } from "./components/user-list";
import { THEME } from "./constants";

const OnlineUsers = () => {
  const { socket, users: _users, msgs } = useContext(SocketContext);
  const users = Array.from(_users.values());
  const [showUserList, setShowUserList] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = users.find(u => u.socketId === socket?.id);

  // Use custom hooks
  const {
    chatContainer,
    showScrollButton,
    unreads,
    scrollToBottom,
    isAtBottomRef
  } = useChatScroll(
    isOpen,
    msgs.length,
    currentUser?.id,
    msgs[msgs.length - 1]?.sessionId
  );

  const {
    typingUsers,
    handleTyping,
    getTypingText
  } = useTyping(
    socket,
    currentUser,
    scrollToBottom,
    isAtBottomRef.current
  );

  const sendMessage = (msg: string) => {
    socket?.emit("msg-send", {
      content: msg,
    });
  };

  const updateUsername = (newName: string) => {
    socket?.emit("username-change", {
      username: newName,
    });
    localStorage.setItem("username", newName);
  };

  const isSingleUser = users.length <= 1;

  return (
    <Popover open={isOpen} onOpenChange={(isOpen) => { setIsOpen(isOpen); if (!isOpen) setShowUserList(false) }}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "mr-4 h-11 w-12 shadow-lg transition-all duration-300 z-50 p-0",
            "bg-background/20 hover:bg-background/80 backdrop-blur-sm border-2 border-white/30 rounded-lg",
          )}
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: [0.1, 2], opacity: [1, 0] }}
                transition={{
                  duration: .4,
                  delay: 0,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="absolute -inset-1 rounded-full bg-green-500/40"
              />
              <Users2 className="w-6 h-6" />
            </div>

            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
              {users.length}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-80 min-h-[400px] sm:w-96 p-0 border-none shadow-2xl overflow-hidden rounded-xl mr-4 mb-4 flex flex-col",
          THEME.bg.primary,
          THEME.text.primary
        )}
        side="top"
      >
        {/* Header */}
        <div className={cn("h-12 flex items-center justify-between px-4 shadow-sm border-b shrink-0", THEME.bg.secondary, THEME.border.primary)}>
          <div className={cn("flex items-center gap-2 font-semibold", THEME.text.header)}>
            <Hash className={cn("w-5 h-5", THEME.text.secondary)} />
            <span>general</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "transition-colors gap-2",
                THEME.bg.hover,
                `hover:${THEME.text.header.replace("text-", "text-")} `,
                "hover:text-[#060607] dark:hover:text-white",
                showUserList && cn(THEME.text.header, THEME.bg.active)
              )}
              onClick={() => setShowUserList(!showUserList)}
            >
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>
                  {users.length}
                </span>
              </div>
              <Users className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className={cn("relative flex flex-col flex-1", THEME.bg.primary)}>
          <ChatMessageList
            msgs={msgs}
            users={users}
            currentUser={currentUser}
            chatContainerRef={chatContainer}
            showScrollButton={showScrollButton}
            unreads={unreads}
            scrollToBottom={scrollToBottom}
            isSingleUser={isSingleUser}
            typingUsers={typingUsers}
            getTypingText={getTypingText}
          />

          <ChatInput
            onSendMessage={sendMessage}
            onTyping={handleTyping}
            placeholder="Message #general"
          />

          <UserList
            users={users}
            socket={socket}
            updateUsername={updateUsername}
            showUserList={showUserList}
          />
        </div>

      </PopoverContent>
    </Popover >
  );
};

export default OnlineUsers;
