import React from "react";
import { cn } from "@/lib/utils";
import { THEME } from "../constants";

interface SystemMessageProps {
  users: { username: string; flag: string }[];
}

export const SystemMessageRow = ({ users }: SystemMessageProps) => {
  const flags = Array.from(new Set(users.map(u => u.flag))).join(" ");

  return (
    <div className={cn("flex items-center gap-3 py-2 select-none", THEME.text.secondary)}>
      <div className={cn("flex-1 h-px", "bg-black/10 dark:bg-white/10")} />
      <span className="text-xs shrink-0">
        {users.length <= 3
          ? <>{users.map(u => `${u.username} ${u.flag}`).join(", ")} joined</>
          : <>{users.length} people visited from {flags}</>
        }
      </span>
      <div className={cn("flex-1 h-px", "bg-black/10 dark:bg-white/10")} />
    </div>
  );
};
