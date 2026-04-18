import { useState, useCallback } from 'react';
import { Conversation, Message } from '../types';
import { mockConversations, mockMessages, currentUser } from '../data/mockData';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function getCurrentTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m} ${ampm}`;
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const selectConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id ? { ...c, unreadCount: 0 } : c
      )
    );
    setActiveConversation({ ...conversation, unreadCount: 0 });
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!activeConversation) return;

      const newMessage: Message = {
        id: generateId(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        text,
        timestamp: getCurrentTime(),
        status: 'sent',
        isMe: true,
      };

      setMessages((prev) => ({
        ...prev,
        [activeConversation.id]: [...(prev[activeConversation.id] ?? []), newMessage],
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, lastMessage: text, lastMessageTime: getCurrentTime() }
            : c
        )
      );

      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [activeConversation.id]: (prev[activeConversation.id] ?? []).map((m) =>
            m.id === newMessage.id ? { ...m, status: 'delivered' } : m
          ),
        }));
      }, 800);
    },
    [activeConversation]
  );

  const activeMessages = activeConversation ? (messages[activeConversation.id] ?? []) : [];

  return {
    conversations,
    activeConversation,
    activeMessages,
    selectConversation,
    sendMessage,
  };
}
