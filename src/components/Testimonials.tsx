import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Executive",
      image: "/api/placeholder/60/60",
      rating: 5,
      text: "The 24/7 chat support changed everything for me. Having instant access to my trainer's guidance kept me motivated even on my toughest days. Lost 25 pounds in 4 months!",
      achievement: "Lost 25 lbs"
    },
    {
      name: "Mike Chen",
      role: "Software Developer",
      image: "/api/placeholder/60/60",
      rating: 5,
      text: "As someone with a busy schedule, the personalized workout plans and nutrition coaching through the chat system were perfect. Gained 15 pounds of muscle!",
      achievement: "Gained 15 lbs muscle"
    },
    {
      name: "Jessica Rodriguez",
      role: "Teacher",
      image: "/api/placeholder/60/60",
      rating: 5,
      text: "The group sessions created an amazing community, and the individual chat support helped me stay accountable. This approach really works!",
      achievement: "Completed first marathon"
    },
    {
      name: "David Thompson",
      role: "Business Owner",
      image: "/api/placeholder/60/60",
      rating: 5,
      text: "Professional, knowledgeable, and always available when I need advice. The combination of in-person and chat support is unbeatable.",
      achievement: "Deadlifted 400 lbs"
    },
    {
      name: "Emily Watson",
      role: "Nurse",
      image: "/api/placeholder/60/60",
      rating: 5,
      text: "The nutrition coaching through the chat system was a game-changer. Quick answers to my questions helped me make better food choices every day.",
      achievement: "Improved energy levels"
    },
    {
      name: "Alex Turner",
      role: "Student",
      image: "/api/placeholder/60/60",
      rating: 5,
      text: "Competing in my first bodybuilding competition thanks to the amazing prep program and constant support through the chat system.",
      achievement: "First competition ready"
    }
  ];

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Success <span className="text-gradient">Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real transformations from real people. See how our personalized approach 
            and 24/7 support system has changed lives.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name} 
              className="card-glass hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Achievement Badge */}
                <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium mb-4">
                  {testimonial.achievement}
                </div>

                {/* User Info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-foreground font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="card-glass max-w-4xl mx-auto p-8">
            <h3 className="text-2xl font-bold mb-8">Proven Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">98%</div>
                <div className="text-muted-foreground">Client Success Rate</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">4.9</div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">500+</div>
                <div className="text-muted-foreground">Success Stories</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">2hrs</div>
                <div className="text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;