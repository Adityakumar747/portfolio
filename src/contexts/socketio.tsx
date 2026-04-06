"use client";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/components/ui/use-toast";

export type User = {
  id: string;
  socketId: string;
  name: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  posX: number;
  posY: number;
  location: string;
  flag: string;
  lastSeen: string;
  createdAt: string;
};
export type Message = {
  id: string;
  sessionId: string;
  flag: string;
  country: string;
  username: string;
  avatar: string;
  color?: string;
  content: string;
  createdAt: string | Date;
}

type SocketContextType = {
  socket: Socket | null;
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  msgs: Message[];
  focusedCursorId: string | null;
  setFocusedCursorId: Dispatch<SetStateAction<string | null>>;
};

const INITIAL_STATE: SocketContextType = {
  socket: null,
  users: [],
  setUsers: () => { },
  msgs: [],
  focusedCursorId: null,
  setFocusedCursorId: () => { },
};

export const SocketContext = createContext<SocketContextType>(INITIAL_STATE);

const SESSION_ID_KEY = "portfolio-site-session-id";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [focusedCursorId, setFocusedCursorId] = useState<string | null>(null);
  const { toast } = useToast();

  // SETUP SOCKET.IO
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_WS_URL) return;
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: {
        sessionId: localStorage.getItem(SESSION_ID_KEY),
      },
    });
    setSocket(newSocket);
    newSocket.on("connect", () => { });
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
    newSocket.on("disconnect", (reason) => {
      // Reconnect on server-initiated disconnect and network drops.
      // "io client disconnect" means the user explicitly called .disconnect(), so skip that.
      if (reason !== "io client disconnect") {
        newSocket.connect();
      }
    });
    newSocket.on("msgs-receive-init", (msgs) => {
      setMsgs(msgs);
    });
    newSocket.on("session", ({ sessionId }) => {
      localStorage.setItem(SESSION_ID_KEY, (sessionId));
    });

    newSocket.on("msg-receive", (msgs) => {
      setMsgs((p) => [...p, msgs]);
    });

    newSocket.on("warning", (data: { message: string }) => {
      toast({
        variant: "destructive",
        title: "System Warning",
        description: data.message,
      });
    });

    newSocket.on("msg-delete", (data: { id: string | number }) => {
      setMsgs((prev) => prev.filter((m) => String(m.id) !== String(data.id)));
    });
    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socket, users, setUsers, msgs, focusedCursorId, setFocusedCursorId }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
