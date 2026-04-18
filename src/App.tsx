import { useChat } from './hooks/useChat';
import { currentUser, groupMembers } from './data/mockData';
import Sidebar from './components/sidebar/Sidebar';
import ChatWindow from './components/chat/ChatWindow';
import EmptyState from './components/common/EmptyState';

export default function App() {
  const { conversations, activeConversation, activeMessages, selectConversation, sendMessage } = useChat();

  const activeMembers = activeConversation?.type === 'group'
    ? groupMembers[activeConversation.id]
    : undefined;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900">
      <Sidebar
        conversations={conversations}
        activeId={activeConversation?.id ?? null}
        onSelect={selectConversation}
        currentUser={currentUser}
      />

      <main className="flex-1 flex overflow-hidden">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            members={activeMembers}
            onSendMessage={sendMessage}
          />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
