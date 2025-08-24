import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <Navigation />
      <Hero />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
