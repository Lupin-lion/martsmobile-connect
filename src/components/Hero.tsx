import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-car.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-automotive-blue to-automotive-dark overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Premium Cars,
            <br />
            <span className="text-automotive-silver">Exceptional Service</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl">
            Discover our curated collection of luxury and reliable automobiles. 
            Quality guaranteed, trust delivered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
              View Our Cars
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Contact WhatsApp
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-automotive-silver" />
              <div>
                <h3 className="font-semibold text-lg">Premium Selection</h3>
                <p className="text-white/70">Handpicked quality vehicles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-automotive-silver" />
              <div>
                <h3 className="font-semibold text-lg">Trusted Service</h3>
                <p className="text-white/70">Years of excellence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-automotive-silver" />
              <div>
                <h3 className="font-semibold text-lg">Happy Customers</h3>
                <p className="text-white/70">Satisfied car owners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;