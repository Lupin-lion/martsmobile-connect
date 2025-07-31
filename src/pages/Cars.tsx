import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import car1 from "@/assets/car1.jpg";
import car2 from "@/assets/car2.jpg";
import car3 from "@/assets/car3.jpg";
import bmwImage from "@/assets/bmw-3series.jpg";

const Cars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extended car data with more vehicles
  const extendedCars = [
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
    {
      id: "4",
      name: "Audi A4",
      price: "$38,000",
      image: car2,
      year: "2022",
      fuel: "Petrol",
      transmission: "Automatic",
      description: "Premium executive sedan with sophisticated styling and cutting-edge technology. Features Quattro all-wheel drive, virtual cockpit, and Bang & Olufsen sound system.",
      mileage: "35,000 km",
      engine: "2.0L TFSI Turbo",
      link: "/cars/audi-a4-2022"
    },
    {
      id: "5",
      name: "Toyota Camry",
      price: "$28,000",
      image: car1,
      year: "2023",
      fuel: "Hybrid",
      transmission: "CVT",
      description: "Reliable midsize sedan with excellent fuel economy and spacious interior. Toyota Safety Sense 2.0, wireless charging, and premium JBL audio system included.",
      mileage: "25,000 km",
      engine: "2.5L Hybrid",
      link: "/cars/toyota-camry-2023"
    },
    {
      id: "6",
      name: "Honda Accord",
      price: "$30,000",
      image: car3,
      year: "2022",
      fuel: "Petrol",
      transmission: "CVT",
      description: "Award-winning sedan with spacious cabin and advanced safety features. Honda Sensing suite, leather-trimmed seating, and dual-zone climate control.",
      mileage: "40,000 km",
      engine: "1.5L Turbo",
      link: "/cars/honda-accord-2022"
    },
    {
      id: "7",
      name: "Lexus ES",
      price: "$42,000",
      image: bmwImage,
      year: "2023",
      fuel: "Hybrid",
      transmission: "CVT",
      description: "Luxury sedan combining comfort, efficiency, and reliability. Features premium interior materials, advanced infotainment, and Lexus Safety System+.",
      mileage: "20,000 km",
      engine: "2.5L Hybrid",
      link: "/cars/lexus-es-2023"
    },
    {
      id: "8",
      name: "Porsche Macan",
      price: "$65,000",
      image: car2,
      year: "2022",
      fuel: "Petrol",
      transmission: "PDK",
      description: "Compact luxury SUV with sports car DNA. Exceptional handling, premium interior, and powerful turbocharged engine. Perfect blend of performance and practicality.",
      mileage: "30,000 km",
      engine: "2.0L Turbo",
      link: "/cars/porsche-macan-2022"
    }
  ];

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cars:", error);
        setCars(extendedCars.map(car => ({
          ...car,
          main_image_url: null
        })));
      } else {
        if (data.length === 0) {
          setCars(extendedCars.map(car => ({
            ...car,
            main_image_url: null
          })));
        } else {
          // Combine database cars with extended sample cars
          const combinedCars = [
            ...data,
            ...extendedCars.slice(data.length).map(car => ({
              ...car,
              main_image_url: null
            }))
          ];
          setCars(combinedCars);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setCars(extendedCars.map(car => ({
        ...car,
        main_image_url: null
      })));
    } finally {
      setLoading(false);
    }
  };

  const getCarImage = (car: any) => {
    if (car.main_image_url) {
      return car.main_image_url;
    }
    
    if (car.name.includes("Mercedes")) return car1;
    if (car.name.includes("BMW")) return bmwImage;
    if (car.name.includes("Volkswagen")) return car3;
    if (car.name.includes("Audi")) return car2;
    if (car.name.includes("Toyota")) return car1;
    if (car.name.includes("Honda")) return car3;
    if (car.name.includes("Lexus")) return bmwImage;
    if (car.name.includes("Porsche")) return car2;
    
    return car1;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading our premium collection...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-background to-automotive-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Button 
              variant="ghost" 
              className="mb-8" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-6">
              <span className="text-primary font-semibold text-sm tracking-wide uppercase">Our Complete Collection</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Premium 
              <span className="block text-primary">Automotive Excellence</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Explore our comprehensive selection of luxury vehicles. From executive sedans to performance SUVs, 
              each vehicle is carefully selected and thoroughly inspected to meet our exacting standards.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and View Options */}
      <section className="py-8 bg-automotive-light border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                All Vehicles ({cars.length})
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">View:</span>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-16 bg-automotive-light">
        <div className="container mx-auto px-4">
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cars;