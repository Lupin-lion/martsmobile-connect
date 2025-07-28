import { Button } from "@/components/ui/button";
import { Car, Phone, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">THE MARTS AUTOMOBILE</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#cars" className="text-foreground hover:text-primary transition-colors">Cars</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button size="sm">Admin Login</Button>
          </div>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;