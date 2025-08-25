import { Dumbbell, Heart, Users, MessageSquare, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      icon: Dumbbell,
      title: "Personal Training",
      description: "One-on-one customized workout plans tailored to your specific goals and fitness level.",
      features: ["Custom workout plans", "Form correction", "Progress tracking", "Equipment guidance"]
    },
    {
      icon: Heart,
      title: "Nutrition Coaching",
      description: "Comprehensive nutrition guidance to fuel your body and accelerate your results.",
      features: ["Meal planning", "Macro tracking", "Supplement advice", "Healthy recipes"]
    },
    {
      icon: Users,
      title: "Group Sessions",
      description: "Motivating group workouts that build community while achieving your fitness goals.",
      features: ["Small group training", "Accountability partners", "Social motivation", "Cost effective"]
    },
    {
      icon: MessageSquare,
      title: "24/7 Chat Support",
      description: "Direct access to your trainer through our chat system for immediate guidance and motivation.",
      features: ["Instant messaging", "Quick form checks", "Motivation boost", "Progress updates"]
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Strategic planning and milestone tracking to ensure you reach your fitness objectives.",
      features: ["SMART goal setting", "Progress milestones", "Regular check-ins", "Plan adjustments"]
    },
    {
      icon: Trophy,
      title: "Competition Prep",
      description: "Specialized training and preparation for fitness competitions and athletic events.",
      features: ["Contest preparation", "Peak conditioning", "Posing practice", "Mental preparation"]
    }
  ];

  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Comprehensive <span className="text-gradient">Fitness Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From personalized training to nutrition coaching and 24/7 support, 
            we provide everything you need to achieve your fitness goals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.title} 
                className="card-glass hover:scale-105 transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="card-glass max-w-2xl mx-auto p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Connect with me through our chat system to discuss your goals and create your personalized fitness plan.
            </p>
            <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl shadow-lg transition-all duration-700 hover:scale-105 hover:shadow-2xl text-lg px-4 py-2">
              Start Your Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;