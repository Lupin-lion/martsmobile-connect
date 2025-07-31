import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Fuel, Calendar, Settings, Gauge, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CarCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  year: string;
  fuel: string;
  transmission: string;
  featured?: boolean;
  description?: string;
  mileage?: string;
  engine?: string;
  link?: string;
}

const CarCard = ({ name, price, image, year, fuel, transmission, featured, description, mileage, engine, link }: CarCardProps) => {
  const navigate = useNavigate();
  
  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in the ${name}. Can you provide more details?`;
    const phoneNumber = "254704698392";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleViewDetails = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-b from-card to-card/50 border-2 border-border/50 hover:border-primary/20 relative overflow-hidden">
      {featured && (
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
            ⭐ Featured
          </Badge>
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <img 
          src={image} 
          alt={name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-gray-800">{year}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-foreground leading-tight">{name}</h3>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{price}</p>
            <p className="text-xs text-muted-foreground">Starting price</p>
          </div>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="h-4 w-4 text-primary" />
              <span className="font-medium">{fuel}</span>
            </div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4 text-primary" />
              <span className="font-medium">{transmission}</span>
            </div>
          </div>
          {mileage && (
            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
              <div className="flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4 text-primary" />
                <span className="font-medium">{mileage}</span>
              </div>
            </div>
          )}
          {engine && (
            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-xs">{engine}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-0 flex-col gap-3">
        {link && (
          <Button 
            onClick={handleViewDetails}
            variant="outline"
            className="w-full h-12 border-2 border-primary/20 hover:border-primary hover:bg-primary/5"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Full Details
          </Button>
        )}
        <Button 
          onClick={handleWhatsAppContact}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Inquire via WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;