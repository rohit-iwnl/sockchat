"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Send } from "lucide-react";

type MessageType = "CHAT" | "JOIN" | "LEAVE";

interface ChatMessage {
  content: string;
  sender: string;
  type: MessageType;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const connectWebSocket = (userName: string) => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/wss"),
      onConnect: () => {
        setIsConnected(true);
        
        client.subscribe("/topic/public", (message) => {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, chatMessage]);
        });

        client.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify({
            sender: userName,
            type: "JOIN",
            content: "",
          }),
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
    });

    client.activate();
    setStompClient(client);
  };

  const handleEnterChatroom = () => {
    if (username.trim()) {
      setCurrentUsername(username);
      setIsDialogOpen(false);
      connectWebSocket(username);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && stompClient && isConnected) {
      const chatMessage: ChatMessage = {
        sender: currentUsername,
        content: messageInput,
        type: "CHAT",
      };

      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage),
      });

      setMessageInput("");
    }
  };

  const getMessageDisplay = (message: ChatMessage) => {
    if (message.type === "JOIN") {
      return (
        <div key={Math.random()} className="flex justify-center my-2">
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {message.sender} joined the chat
          </span>
        </div>
      );
    }

    if (message.type === "LEAVE") {
      return (
        <div key={Math.random()} className="flex justify-center my-2">
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {message.sender} left the chat
          </span>
        </div>
      );
    }

    const isOwnMessage = message.sender === currentUsername;

    return (
      <div
        key={Math.random()}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-3`}
      >
        <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
          <span className="text-xs text-muted-foreground mb-1 px-1">
            {isOwnMessage ? "You" : message.sender}
          </span>
          <div
            className={`px-4 py-2 rounded-lg ${
              isOwnMessage
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-foreground font-sans dark:bg-black p-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Chatroom</DialogTitle>
            <DialogDescription>
              Please enter your username to join the chatroom.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEnterChatroom();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEnterChatroom}>Enter Chatroom</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {currentUsername && (
        <Card className="w-full max-w-4xl h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Chatroom</span>
              <span className="text-sm font-normal text-muted-foreground">
                {isConnected ? "● Connected" : "○ Disconnected"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-2 pb-4">
                {messages.map((message) => getMessageDisplay(message))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  disabled={!isConnected}
                />
                <Button onClick={sendMessage} disabled={!isConnected} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
