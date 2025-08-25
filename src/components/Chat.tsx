import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Profile {
  full_name: string;
  email: string;
}

interface ChatProps {
  currentUserId: string;
  targetUserId: string;
  onBack: () => void;
}

const Chat = ({ currentUserId, targetUserId, onBack }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [targetProfile, setTargetProfile] = useState<Profile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize chat and load target profile
  useEffect(() => {
    initializeChat();
    fetchTargetProfile();
  }, [currentUserId, targetUserId]);

  // Subscribe to messages
  useEffect(() => {
    if (!chatId) return;
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id !== currentUserId) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, currentUserId]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTargetProfile = async () => {
    if (!targetUserId) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('user_id', targetUserId)
      .single();
    if (!error) setTargetProfile(data);
  };

  const initializeChat = async () => {
    try {
      // Check for existing chat
      const { data: existingChat, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .or(`and(client_id.eq.${currentUserId},trainer_id.eq.${targetUserId}),and(client_id.eq.${targetUserId},trainer_id.eq.${currentUserId})`)
        .single();

      let chatData = existingChat;

      if (!existingChat) {
        // Create new chat
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            client_id: currentUserId,
            trainer_id: targetUserId
          })
          .select()
          .single();

        if (createError) throw createError;
        chatData = newChat;
      }

      setChatId(chatData.id);
      await loadMessages(chatData.id);
    } catch (error: any) {
      console.error('Error initializing chat:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to initialize chat'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) console.error('Error loading messages:', error);
    else setMessages(data || []);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || sending) return;

    setSending(true);
    const content = newMessage.trim();

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      sender_id: currentUserId,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');

    const { error } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, sender_id: currentUserId, content });

    if (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      setNewMessage(content);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message'
      });
    }

    setSending(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {targetProfile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold">{targetProfile?.full_name || 'User'}</h1>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gradient">COACH</div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Start your conversation</h3>
              <p className="text-muted-foreground">Send a message to begin chatting.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender_id === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender_id === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={sending}
                />
                <Button type="submit" disabled={sending || !newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;