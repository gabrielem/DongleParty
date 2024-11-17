"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/helpers/api";
import { formatTimestampForMessages } from "@/utils/utils";
import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import Loading from "./UI/Loading";

interface Message {
  me?: boolean;
  bot?: boolean;
  message: string;
  date: string;
}

interface Props {
  challengeId: any;
  challenge: any;
  myPartecipation: any;
}

export default function AgentChat({
  challengeId,
  challenge,
  myPartecipation,
}: Props): JSX.Element {
  const { token } = useAuth();

  const [message, setMessage] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<
    { me?: boolean; bot?: boolean; message: string; date: any }[]
  >([]);

  useEffect(() => {
    const getMessages = async () => {
      const response = await api.getMessages({ challengeId }, token);
      const msgs = response?.messages ?? [];
      setMessages(msgs);
    };
    getMessages();
  }, [challengeId, token]);

  //   const messages: Message[] = [
  //     { me: true, message: "Ciao sono un utente", date: "11112" },
  //     { bot: true, message: "Ciao sono il bot", date: "11114" },
  //   ]

  // Gestisce l'auto-resize della textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 96)}px`; // 96px = 3 righe circa
    }
  }, [message]);

  const addItem = (bot?: boolean, msg?: any) => {
    const how = bot ? { bot: true } : { me: true };
    const newItem = { ...how, message: msg || message, date: Date.now() };

    setMessages((prevItems) => [...prevItems, newItem]);
    return newItem;
  };

  const setMsg = async (item: any) => {
    // console.log('🍎🍎🍎setMessage', {message, item});
    setLoadingResponse(true);
    try {
      const payload = { message: item, challengeId };
      // console.log('🍎🍎🍎setMessage - payload', payload);

      const result = await api.setMessage(payload, token);
      // console.log('🍎🍎🍎setMessage - result', result.response);
      addItem(true, result.response);
      // result.response
    } catch (error: any) {
      // console.log('🍎🍎🍎setMessage - error', {error});
      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Error sending message"
      );
    } finally {
      setLoadingResponse(false);
    }
  };
  const handleSubmit = () => {
    if (!message.trim()) return;
    const item = addItem();
    setMsg(item);
    // console.log('Messaggio inviato:', message)
    setMessage("");

    // Reset height textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 shadow-lg pb-20 rounded-lg h-[calc(100vh-theme(spacing.20))]">
      {/* Message area with flex-1 and proper overflow handling */}
      <div className="flex-1 p-4 min-h-0 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.me ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.me
                  ? "bg-green-300 text-gray-800 rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
              >
                <p className="text-sm">{typeof msg.message === 'string' ? msg.message : msg.message.response}</p>
                <span
                  className={`text-xs ${msg.me ? "text-primary-content" : "text-gray-500"
                    } mt-1 block`}
                >
                  {formatTimestampForMessages(msg.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
        {loadingResponse && <Loading heightType="h-full" />}
      </div>

      {/* Input area with fixed position at bottom */}
      <div className="right-0 bottom-0 left-0 sticky bg-white p-4 border-t">
        <div className="flex items-end gap-2 max-w-full">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write me a message..."
            className="flex-1 bg-gray-100 focus:bg-white px-4 py-2 rounded-xl focus:ring-2 focus:ring-primary min-h-[40px] max-h-24 text-gray-600 transition-all overflow-hidden resize-none focus:outline-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className={`p-2 rounded-full flex-shrink-0 ${message.trim()
              ? "bg-gray-100 text-gray-700 hover:bg-primary-focus"
              : "bg-gray-200 text-gray-400"
              } transition-colors`}
          >
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
