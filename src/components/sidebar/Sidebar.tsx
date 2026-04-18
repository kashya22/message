import { useState } from 'react';
import { CreditCard as Edit, Settings, Bell, ChevronDown } from 'lucide-react';
import { Conversation, User } from '../../types';
import SearchBar from './SearchBar';
import ConversationList from './ConversationList';
import Avatar from '../common/Avatar';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conversation: Conversation) => void;
  currentUser: User;
}

export default function Sidebar({ conversations, activeId, onSelect, currentUser }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <aside className="w-72 flex-shrink-0 bg-slate-900 flex flex-col h-full border-r border-slate-800">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-white font-bold text-base tracking-tight">Messenger</h1>
          </div>
          <div className="flex items-center gap-1">
            {totalUnread > 0 && (
              <div className="relative">
                <Bell size={17} className="text-slate-400 hover:text-slate-200 cursor-pointer transition" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-white text-xs flex items-center justify-center font-bold leading-none" style={{ fontSize: '9px' }}>
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              </div>
            )}
            <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition">
              <Edit size={16} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition">
              <Settings size={16} />
            </button>
          </div>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={onSelect}
        searchQuery={search}
      />

      <div className="border-t border-slate-800 px-3 py-3">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition group"
        >
          <Avatar name={currentUser.name} size="sm" status={currentUser.status} showStatus />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-slate-200 truncate">{currentUser.name}</p>
            <p className="text-xs text-emerald-400 capitalize">{currentUser.status}</p>
          </div>
          <ChevronDown size={14} className={`text-slate-500 group-hover:text-slate-300 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
        </button>

        {showUserMenu && (
          <div className="mt-1 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 text-sm">
            {(['online', 'away', 'busy', 'offline'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setShowUserMenu(false)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-700 transition capitalize ${
                  currentUser.status === s ? 'text-white' : 'text-slate-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  s === 'online' ? 'bg-emerald-400' :
                  s === 'away' ? 'bg-amber-400' :
                  s === 'busy' ? 'bg-rose-400' :
                  'bg-slate-500'
                }`} />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
