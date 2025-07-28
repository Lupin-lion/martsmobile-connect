import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CarsSection from "@/components/CarsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CarsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
