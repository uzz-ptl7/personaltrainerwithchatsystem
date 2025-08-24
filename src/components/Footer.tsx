import { MessageCircle, Instagram, Twitter, Facebook, Youtube, Heart } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    services: [
      { name: "Personal Training", href: "#services" },
      { name: "Nutrition Coaching", href: "#services" },
      { name: "Group Sessions", href: "#services" },
      { name: "Competition Prep", href: "#services" }
    ],
    support: [
      { name: "Chat Support", href: "#contact" },
      { name: "FAQ", href: "#" },
      { name: "Contact Us", href: "#contact" },
      { name: "Book Session", href: "#" }
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Disclaimer", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gradient">FitCoach</h3>
            <p className="text-muted-foreground">
              Transform your body and elevate your life with personalized training, 
              nutrition guidance, and 24/7 support through our revolutionary chat system.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 link-hover"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 link-hover"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Chat */}
          <div>
            <h4 className="font-bold text-lg mb-4">Stay Connected</h4>
            <p className="text-muted-foreground mb-4">
              Get fitness tips and updates delivered to your inbox.
            </p>
            <div className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-input border border-border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-xl hover:bg-accent transition-colors">
                  Subscribe
                </button>
              </div>
              <button className="w-full btn-hero flex items-center justify-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">
                © 2024 FitCoach. Made with
              </span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-muted-foreground">for your fitness journey.</span>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-secondary/30 rounded-xl border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              <strong>24/7 Chat Support Available:</strong> Get instant answers to your fitness questions, 
              form checks, motivation, and guidance whenever you need it through our integrated chat system.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;