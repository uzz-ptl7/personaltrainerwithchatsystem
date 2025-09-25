import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MessageCircle, LogOut, Users, Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Chat from '@/components/Chat';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  created_at?: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [clients, setClients] = useState<Profile[]>([]);
  const [trainer, setTrainer] = useState<Profile | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  // Fetch current user profile
  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  // Fetch related profiles
  useEffect(() => {
    if (profile?.role === 'trainer') fetchClients();
    else if (profile?.role === 'client') fetchTrainer();
  }, [profile]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load profile',
      });
    } else setProfile(data);
  };

  const fetchClients = async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq('role', 'client');
    if (error) console.error('Error fetching clients:', error);
    else setClients(data || []);
  };

  const fetchTrainer = async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq('role', 'trainer').single();
    if (error) console.error('Error fetching trainer:', error);
    else setTrainer(data);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({ title: 'Signed out', description: 'You have been successfully signed out.' });
  };

  const handleStartChat = (targetUserId?: string) => {
    if (profile?.role === 'trainer' && targetUserId) setSelectedUserId(targetUserId);
    else if (profile?.role === 'client' && trainer) setSelectedUserId(trainer.user_id);
    setShowChat(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );

  if (showChat && selectedUserId)
    return <Chat currentUserId={user?.id || ''} targetUserId={selectedUserId} onBack={() => setShowChat(false)} />;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out
                      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex md:flex-col`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <Link to="/" className="text-2xl font-bold text-gradient">COACH</Link>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar menu"
            aria-label="Close sidebar menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-4">
          <Badge variant="secondary" className="w-full text-center">{profile?.role === 'trainer' ? 'Trainer' : 'Client'} Dashboard</Badge>
          <Button variant="ghost" className="w-full flex items-center justify-start" onClick={() => { setSidebarOpen(false); navigate('/'); }}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Home
          </Button>
          <Button variant="ghost" className="w-full flex items-center justify-start" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg sticky top-0 z-40 flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar menu"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg">{profile?.role === 'trainer' ? 'Trainer' : 'Client'} Dashboard</span>
          <div></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name || 'User'}!</h1>
              <p className="text-muted-foreground">
                {profile?.role === 'trainer'
                  ? 'Manage your client conversations and help them achieve their fitness goals.'
                  : 'Connect with your trainer and track your fitness journey.'}
              </p>
            </div>
          </div>

          {/* Dashboard Content */}
          {profile?.role === 'trainer' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center"><Users className="w-5 h-5 mr-2" />Your Clients</h2>
                <Badge variant="outline">{clients.length} total clients</Badge>
              </div>

              {clients.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No clients yet</h3>
                    <p className="text-muted-foreground text-center">
                      When clients sign up, they'll appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {clients.map(client => (
                    <Card key={client.id} className="glass-card hover:border-primary/50 transition-colors cursor-pointer">
                      <CardHeader className="pb-3 flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-secondary">{client.full_name?.charAt(0) || 'C'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{client.full_name || 'Unknown Client'}</CardTitle>
                          <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button className="w-full btn-hero" size="sm" onClick={() => handleStartChat(client.user_id)}>
                          <MessageCircle className="w-4 h-4 mr-2" />Open Chat
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center"><MessageCircle className="w-5 h-5 mr-2" />Your Trainer</CardTitle>
              </CardHeader>
              <CardContent>
                {trainer ? (
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">{trainer.full_name?.charAt(0) || 'T'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{trainer.full_name || 'Trainer'}</p>
                        <p className="text-sm text-muted-foreground">{trainer.email}</p>
                      </div>
                    </div>
                    <Button className="btn-hero w-full" onClick={() => handleStartChat()}>
                      <MessageCircle className="w-4 h-4 mr-2" />Start Chat
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No trainer assigned. Contact support.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
