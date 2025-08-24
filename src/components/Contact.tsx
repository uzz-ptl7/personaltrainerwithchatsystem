import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Call for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      details: "coach@fitcoach.com",
      description: "Send us your questions"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "123 Fitness St, Gym City",
      description: "Visit our training facility"
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon-Fri: 6AM-9PM",
      description: "Weekend by appointment"
    }
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to start your fitness journey? Reach out through our chat system, 
            give us a call, or fill out the form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-primary" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input placeholder="John" className="bg-input border-border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input placeholder="Doe" className="bg-input border-border" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="bg-input border-border" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input type="tel" placeholder="+1 (555) 123-4567" className="bg-input border-border" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Fitness Goals</label>
                  <Textarea 
                    placeholder="Tell me about your fitness goals and what you'd like to achieve..."
                    className="bg-input border-border min-h-32"
                  />
                </div>
                
                <Button className="w-full btn-hero">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Chat CTA */}
            <Card className="card-glass bg-gradient-primary border-none text-primary-foreground">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-2">Prefer to Chat?</h3>
                <p className="mb-4 opacity-90">
                  Get instant responses and start your fitness consultation right away.
                </p>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card 
                  key={info.title} 
                  className="card-glass hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                      <p className="text-primary font-semibold mb-1">{info.details}</p>
                      <p className="text-muted-foreground text-sm">{info.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Map Placeholder */}
            <Card className="card-glass overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-muted to-secondary/50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">123 Fitness St, Gym City</p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="card-glass">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Response Times</h3>
                 <div className="space-y-3">
                   <div className="flex justify-between">
                     <span>Chat Messages</span>
                     <span className="text-primary font-semibold">&lt; 5 minutes</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Email Replies</span>
                     <span className="text-primary font-semibold">&lt; 2 hours</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Phone Calls</span>
                     <span className="text-primary font-semibold">&lt; 30 minutes</span>
                   </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;