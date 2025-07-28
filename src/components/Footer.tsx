import { Car, MessageCircle, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-automotive-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-8 w-8 text-automotive-silver" />
              <h3 className="text-2xl font-bold">THE MARTS AUTOMOBILE</h3>
            </div>
            <p className="text-white/80 mb-4 max-w-md">
              Your trusted partner in finding the perfect vehicle. We provide premium cars with exceptional service and transparent dealings.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#cars" className="hover:text-white transition-colors">Our Cars</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-white/80">
              <li>+254 769 839 2</li>
              <li>themartswritters@gmail.com</li>
              <li>Juja City</li>
              <li>Mon-Sat: 9AM-7PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2024 The Marts Automobile. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;