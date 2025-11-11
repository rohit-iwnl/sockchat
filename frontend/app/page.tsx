"use client";

import { useState } from "react";
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

export default function Home() {
  const [username, setUsername] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("");

  const handleEnterChatroom = () => {
    if (username.trim()) {
      setCurrentUsername(username);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-foreground font-sans dark:bg-black">
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
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome, {currentUsername}!</h1>
        </div>
      )}
    </div>
  );
}
