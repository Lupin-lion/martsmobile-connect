import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Phone, MapPin, Clock, Star } from "lucide-react";

const ContactSection = () => {
  const handleWhatsAppContact = () => {
    const message = "Hi! I'm interested in your automobile services. Can you help me?";
    const phoneNumber = "2547698392";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-automotive-blue to-automotive-dark text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In Touch With Us
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Ready to find your perfect car? Contact us directly via WhatsApp for instant assistance and personalized service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <MessageCircle className="h-12 w-12 text-green-400" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">WhatsApp Contact</h3>
                    <p className="text-white/80 mb-4">
                      Get instant responses and personalized car recommendations directly through WhatsApp.
                    </p>
                    <Button 
                      onClick={handleWhatsAppContact}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat on WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-3 text-automotive-silver" />
                  <h4 className="font-semibold mb-2">Phone</h4>
                  <p className="text-white/80">+254 769 839 2</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-3 text-automotive-silver" />
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-white/80">Juja City</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-automotive-silver" />
                  <h4 className="font-semibold mb-2">Hours</h4>
                  <p className="text-white/80">Mon-Sat: 9AM-7PM</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 mx-auto mb-3 text-automotive-silver" />
                  <h4 className="font-semibold mb-2">Rating</h4>
                  <p className="text-white/80">4.9/5 ★★★★★</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Why Choose The Marts Automobile?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-automotive-silver rounded-full mt-2"></div>
                <p className="text-white/90">Premium quality vehicles thoroughly inspected</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-automotive-silver rounded-full mt-2"></div>
                <p className="text-white/90">Competitive pricing with transparent deals</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-automotive-silver rounded-full mt-2"></div>
                <p className="text-white/90">Expert advice and personalized service</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-automotive-silver rounded-full mt-2"></div>
                <p className="text-white/90">After-sales support and warranty</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-automotive-silver rounded-full mt-2"></div>
                <p className="text-white/90">Fast WhatsApp communication for quick decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;