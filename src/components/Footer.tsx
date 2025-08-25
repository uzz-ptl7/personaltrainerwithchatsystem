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
            <h3 className="text-2xl font-bold text-gradient">Coach</h3>
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
              <button className="w-full flex items-center justify-center bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-accent/30 transition-all duration-700 hover:shadow-xl text-lg px-6 py-2">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat Now
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
          <div className="mt-8 p-4 bg-secondary/30 rounded-xl border border-border/50 mb-2">
            <p className="text-sm text-muted-foreground text-center">
              <strong>24/7 Chat Support Available:</strong> Get instant answers to your fitness questions, 
              form checks, motivation, and guidance whenever you need it through our integrated chat system.
            </p>
          </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © 2025 Coach. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <p className="text-muted-foreground mx-2">
                Made with ❤️ in Rwanda by the{" "}
                <a 
                  href="https://www.sitecraftersz.co/" 
                  className="text-primary hover:text-primary/80 transition-colors underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Sitecrafters Team
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;