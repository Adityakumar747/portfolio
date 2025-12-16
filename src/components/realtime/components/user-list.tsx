import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Edit } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import type { User } from "@/contexts/socketio";
import type { Socket } from "socket.io-client";
import { THEME } from "../constants";

interface UserListProps {
  users: User[];
  socket: Socket | null;
  updateUsername: (username: string) => void;
  showUserList: boolean;
}

export const UserList = ({ users, socket, updateUsername, showUserList }: UserListProps) => {
  const sortedUsers = [...users].sort((a, b) => {
    if (a.socketId === socket?.id) return -1;
    if (b.socketId === socket?.id) return 1;
    return 0;
  });

  return (
    <AnimatePresence>
      {showUserList && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className={cn("absolute inset-y-0 right-0 w-60 shadow-xl z-20 flex flex-col border-l", THEME.bg.secondary, THEME.border.primary)}
        >
          <div className="p-4 pb-2">
            <h3 className={cn("text-xs font-bold uppercase tracking-wide mb-2", THEME.text.secondary)}>
              Online — {users.length}
            </h3>
          </div>
          <ScrollArea className="flex-1 px-2" data-lenis-prevent >
            <div className="space-y-0.5 pb-4">
              {sortedUsers.map((user) => (
                <UserItem
                  key={user.socketId}
                  user={user}
                  socket={socket}
                  updateUsername={updateUsername}
                />
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UserItem = ({
  user,
  socket,
  updateUsername,
}: {
  user: User;
  socket: Socket | null;
  updateUsername: (username: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const isMe = user.socketId === socket?.id;

  const handleSave = () => {
    if (name.trim()) {
      updateUsername(name);
      setIsEditing(false);
    }
  };

  return (
    <div className={cn("group flex items-center gap-3 p-2 rounded transition-colors cursor-pointer relative", THEME.bg.itemHover)}>
      <div className="relative">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: user.color }}
        >
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div className={cn("absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2", THEME.border.status)} />
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn("w-full text-sm px-1 py-0.5 rounded border-none outline-none", "bg-white dark:bg-[#1e1f22]", THEME.text.header)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditing(false);
              }}
              onBlur={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between"
            onClick={(e) => {
              e.stopPropagation();
              if (isMe)
                setIsEditing(true);
            }}
          >
            <div className="flex gap-1 items-center">
              <span className={cn("font-medium truncate text-sm", isMe ? THEME.text.header : cn(THEME.text.secondary, THEME.text.hover))}>
                {user.name}
              </span>
              {isMe && (
                <span className="bg-[#5865f2] text-white text-[10px] px-1 rounded font-bold">
                  YOU
                </span>
              )}
            </div>
            {isMe && (
              <Button
                variant={'ghost'}
                size={'icon'}
                className="w-4 h-4"
              >
                <Edit
                  className={cn("w-3 h-3 hover:text-[#060607] dark:hover:text-white", THEME.text.secondary)}
                />
              </Button>
            )}
          </div>
        )}
        {isEditing ? (
          <span className={cn("text-[10px]", THEME.text.secondary)}>Press Enter to save</span>
        ) : (
          <div className={cn("text-[10px] truncate space-x-1", THEME.text.secondary)}>
            <span>
              {user.location}
            </span>
            <span>
              {user.flag}
            </span>
            {/* {isMe ? "Playing VS Code" : "Just vibing"} */}
          </div>
        )}
      </div>
    </div>
  );
};
