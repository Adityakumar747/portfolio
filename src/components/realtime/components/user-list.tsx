import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Edit } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import type { User } from "@/contexts/socketio";
import type { Socket } from "socket.io-client";
import { THEME } from "../constants";
import { getAvatarUrl } from "@/lib/avatar";

interface UserListProps {
  users: User[];
  socket: Socket | null;
  updateProfile: (data: { name: string; avatar: string; color: string }) => void;
  showUserList: boolean;
  onClose: () => void;
}

export const UserList = ({ users, socket, updateProfile, showUserList, onClose }: UserListProps) => {
  const sortedUsers = [...users].sort((a, b) => {
    if (a.socketId === socket?.id) return -1;
    if (b.socketId === socket?.id) return 1;
    return 0;
  });

  return (
    <AnimatePresence>
      {showUserList && (
        <>
          {/* Overlay to close user list when clicking on messages area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-10 cursor-pointer"
            onClick={onClose}
          />
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
                    updateProfile={updateProfile}
                  />
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const COLORS = [
  "#60a5fa",
  "#f87171",
  "#4ade80",
  "#facc15",
  "#c084fc",
  "#fb923c",
  "#f43f5e",
  "#818cf8",
  "#22d3ee",
  "#a3e635",
];

const UserItem = ({
  user,
  socket,
  updateProfile,
}: {
  user: User;
  socket: Socket | null;
  updateProfile: (data: { name: string; avatar: string; color: string }) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatarSeed, setAvatarSeed] = useState(user.avatar);
  const [color, setColor] = useState(user.color || COLORS[0]);
  const isMe = user.socketId === socket?.id;

  const handleSave = () => {
    if (name.trim()) {
      updateProfile({ name, avatar: avatarSeed, color });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setAvatarSeed(user.avatar);
    setColor(user.color || COLORS[0]);
    setIsEditing(false);
  };

  // Editing UI - Render as a floating overlay card using Portal
  if (isEditing) {
    return createPortal(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center"
        onClick={handleCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
          className={cn(
            "w-[500px] h-[500px] p-4 rounded-xl shadow-2xl flex flex-col",
            "bg-white dark:bg-[#2b2d31] border border-white/10",
            "ring-1 ring-black/5 dark:ring-white/10"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with preview */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-black/10 dark:border-white/10">
            <div className="relative">
              <img
                src={getAvatarUrl(avatarSeed)}
                alt="Preview"
                className="w-12 h-12 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#2b2d31]"
                style={{ backgroundColor: color, "--tw-ring-color": color } as React.CSSProperties}
              />
            </div>
            <div className="flex-1">
              <div className={cn("text-xs font-medium uppercase tracking-wide mb-1", THEME.text.secondary)}>
                Edit Profile
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={cn(
                  "w-full text-base font-semibold px-2 py-1 rounded-md border-none outline-none",
                  "bg-black/5 dark:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10",
                  "transition-colors",
                  THEME.text.header
                )}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>
          </div>

          {/* Avatar selection */}
          <div className="mb-4 flex-1 flex flex-col min-h-0">
            <div className={cn("text-xs font-medium uppercase tracking-wide mb-2", THEME.text.secondary)}>
              Avatar
            </div>
            <ScrollArea className="flex-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20" data-lenis-prevent>
              <div className="grid grid-cols-6 gap-1.5 p-2">
                {Array.from({ length: 100 }, (_, i) => (i + 1).toString()).map((seed) => (
                  <button
                    key={seed}
                    className={cn(
                      "rounded-full p-0.5 transition-all hover:scale-105",
                      avatarSeed === seed
                        ? "bg-[#5865f2] ring-2 ring-[#5865f2] scale-105"
                        : "hover:bg-black/10 dark:hover:bg-white/10"
                    )}
                    onClick={() => setAvatarSeed(seed)}
                  >
                    <img src={getAvatarUrl(seed)} className="w-full h-full rounded-full" style={{ backgroundColor: color }} loading="lazy" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Color selection */}
          <div className="mb-5">
            <div className={cn("text-xs font-medium uppercase tracking-wide mb-2", THEME.text.secondary)}>
              Accent Color
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all hover:scale-110",
                    color === c && "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#2b2d31] scale-110 shadow-lg"
                  )}
                  style={{ backgroundColor: c, "--tw-ring-color": c } as React.CSSProperties}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-black/10 dark:border-white/10">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-8 px-4 text-sm"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 px-4 text-sm bg-[#5865f2] hover:bg-[#4752c4] text-white"
            >
              Save Changes
            </Button>
          </div>
        </motion.div>
      </motion.div>,
      document.body
    );
  }


  // Normal user item display
  return (
    <div className={cn("group flex flex-col p-2 rounded transition-colors relative", THEME.bg.itemHover)}>
      <div className="flex items-center gap-3 w-full">
        <div className="relative">
          <img
            src={getAvatarUrl(user.avatar)}
            alt={user.name}
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: user.color || '#60a5fa' }}
          />
          <div className={cn("absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2", THEME.border.status)} />
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={cn("flex items-center justify-between", isMe && "cursor-pointer")}
            onClick={(e) => {
              e.stopPropagation();
              if (isMe) setIsEditing(true);
            }}
          >
            <div className="flex gap-1 items-center">
              <span
                className={cn("font-medium truncate text-sm", isMe ? THEME.text.header : cn(THEME.text.secondary, THEME.text.hover))}
                style={{ color: !isMe ? user.color : undefined }}
              >
                {user.name}
              </span>
              {isMe && <span className="bg-[#5865f2] text-white text-[10px] px-1 rounded font-bold">YOU</span>}
            </div>
            {isMe && (
              <Button variant={'ghost'} size={'icon'} className="w-5 h-5">
                <Edit className={cn("w-3 h-3 hover:text-[#060607] dark:hover:text-white", THEME.text.secondary)} />
              </Button>
            )}
          </div>
          <div className={cn("text-[10px] truncate space-x-1", THEME.text.secondary)}>
            <span>{user.location}</span>
            <span>{user.flag}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
