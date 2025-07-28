import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Fuel, Calendar, Settings } from "lucide-react";

interface CarCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  year: string;
  fuel: string;
  transmission: string;
  featured?: boolean;
}

const CarCard = ({ name, price, image, year, fuel, transmission, featured }: CarCardProps) => {
  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in the ${name}. Can you provide more details?`;
    const phoneNumber = "254704698392";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-b from-card to-automotive-light">
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-automotive-blue text-white">Featured</Badge>
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-3xl font-bold text-primary mb-4">{price}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            <span>{fuel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>{transmission}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleWhatsAppContact}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Contact via WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;