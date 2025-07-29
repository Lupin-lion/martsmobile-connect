import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "./CarCard";
import { Button } from "@/components/ui/button";
import { Plus, Car as CarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import car1 from "@/assets/car1.jpg";
import car2 from "@/assets/car2.jpg";
import car3 from "@/assets/car3.jpg";
import bmwImage from "@/assets/bmw-3series.jpg";

const CarsSection = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sample car data as fallback
  const sampleCars = [
    {
      id: "1",
      name: "Mercedes-Benz GLE",
      price: "$45,000",
      image: car1,
      year: "2022",
      fuel: "Petrol",
      transmission: "Automatic",
      featured: true,
      description: "Luxury SUV with premium interior, advanced safety features, and powerful performance. Includes leather seats, panoramic sunroof, navigation system, and AWD. Perfect for both city driving and long journeys.",
      mileage: "45,000 km",
      engine: "3.0L V6 Turbo",
      link: "/cars/mercedes-gle-2022"
    },
    {
      id: "2", 
      name: "BMW 3 Series",
      price: "$32,000",
      image: bmwImage,
      year: "2021",
      fuel: "Petrol",
      transmission: "Automatic",
      description: "Sport sedan with dynamic handling and refined comfort. Features BMW's latest infotainment system, sport seats, and premium sound system. Excellent fuel efficiency and driving dynamics.",
      mileage: "52,000 km",
      engine: "2.0L 4-Cylinder Turbo",
      link: "/cars/bmw-3series-2021"
    },
    {
      id: "3",
      name: "Volkswagen Golf",
      price: "$24,000",
      image: car3,
      year: "2023",
      fuel: "Petrol",
      transmission: "Manual",
      description: "Compact hatchback perfect for urban driving. Modern design with excellent build quality, spacious interior, and advanced safety features. Great value for money with low running costs.",
      mileage: "15,000 km",
      engine: "1.4L 4-Cylinder",
      link: "/cars/volkswagen-golf-2023"
    },
  ];

  useEffect(() => {
    checkAuth();
    fetchCars();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    
    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      
      setIsAdmin(profile?.role === "admin");
    }
  };

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cars:", error);
        // Use sample data as fallback
        setCars(sampleCars.map(car => ({
          ...car,
          image_url: null // Use local images for sample data
        })));
      } else {
        // If no cars in database, show sample cars
        if (data.length === 0) {
          setCars(sampleCars.map(car => ({
            ...car,
            image_url: null
          })));
        } else {
          setCars(data);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setCars(sampleCars.map(car => ({
        ...car,
        image_url: null
      })));
    } finally {
      setLoading(false);
    }
  };

  const getCarImage = (car: any) => {
    // Use image_url from database if available, otherwise use sample images
    if (car.image_url) {
      return car.image_url;
    }
    
    // Use local images for sample data
    if (car.name.includes("Mercedes")) return car1;
    if (car.name.includes("BMW")) return bmwImage;
    if (car.name.includes("Volkswagen")) return car3;
    
    return car1; // Default image
  };

  if (loading) {
    return (
      <section id="cars" className="py-20 bg-automotive-light">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <CarIcon className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <p>Loading cars...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="cars" className="py-20 bg-automotive-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Premium Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully selected vehicles, each inspected and guaranteed for quality and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cars.map((car) => (
            <CarCard 
              key={car.id} 
              {...car} 
              image={getCarImage(car)}
              mileage={car.mileage}
              engine={car.engine}
              description={car.description}
            />
          ))}
        </div>

        <div className="text-center">
          {isAdmin ? (
            <Button 
              size="lg" 
              className="bg-automotive-blue hover:bg-automotive-blue/90"
              onClick={() => navigate("/admin")}
            >
              <Plus className="mr-2 h-5 w-5" />
              Manage Cars
            </Button>
          ) : user ? (
            <Button size="lg" variant="outline">
              View All Cars
            </Button>
          ) : (
            <Button size="lg" onClick={() => navigate("/auth")}>
              Login to Manage Cars
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CarsSection;