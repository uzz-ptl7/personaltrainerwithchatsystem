import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MessageCircle, LogOut, Users } from 'lucide-react';
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
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile?.role === 'trainer') {
      fetchClients();
    }
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
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile"
      });
    } else {
      setProfile(data);
    }
  };

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client');

    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data || []);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out."
    });
  };

  const handleStartChat = (clientId?: string) => {
    if (profile?.role === 'trainer' && clientId) {
      setSelectedClientId(clientId);
    } else if (profile?.role === 'client') {
      // For clients, find a trainer to chat with (for demo, we'll use the first trainer found)
      // In a real app, this would be their assigned trainer
      setSelectedClientId('trainer'); // This would be the actual trainer ID
    }
    setShowChat(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (showChat) {
    return (
      <Chat
        currentUserId={user?.id || ''}
        targetUserId={selectedClientId || ''}
        onBack={() => setShowChat(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-gradient">
                COACH
              </Link>
              <Badge variant="secondary">
                {profile?.role === 'trainer' ? 'Trainer Dashboard' : 'Client Dashboard'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name || 'User'}!</h1>
              <p className="text-muted-foreground">
                {profile?.role === 'trainer' 
                  ? 'Manage your client conversations and help them achieve their fitness goals.'
                  : 'Connect with your trainer and track your fitness journey.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {profile?.role === 'trainer' ? (
          // Trainer Dashboard
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Your Clients
              </h2>
              <Badge variant="outline">{clients.length} total clients</Badge>
            </div>

            {clients.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No clients yet</h3>
                  <p className="text-muted-foreground text-center">
                    When clients sign up and choose you as their trainer, they'll appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clients.map((client) => (
                  <Card key={client.id} className="glass-card hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-secondary">
                            {client.full_name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">
                            {client.full_name || 'Unknown Client'}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground truncate">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        className="w-full btn-hero" 
                        size="sm"
                        onClick={() => handleStartChat(client.user_id)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Open Chat
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Client Dashboard
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Connect with Your Trainer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start a conversation with your personal trainer to discuss your fitness goals, 
                  ask questions, and get personalized guidance.
                </p>
                <Button className="btn-hero" onClick={() => handleStartChat()}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat with Trainer
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member since</span>
                      <span>
                        {profile?.created_at 
                          ? new Date(profile.created_at).toLocaleDateString()
                          : 'Recently'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Chat with your trainer
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-muted rounded-full mr-3"></div>
                      Set your fitness goals
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-muted rounded-full mr-3"></div>
                      Schedule your first session
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;