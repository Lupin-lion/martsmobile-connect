import CarCard from "./CarCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import car1 from "@/assets/car1.jpg";
import car2 from "@/assets/car2.jpg";
import car3 from "@/assets/car3.jpg";

const CarsSection = () => {
  // Sample car data - in a real app, this would come from a database
  const cars = [
    {
      id: "1",
      name: "Mercedes-Benz GLE",
      price: "$45,000",
      image: car1,
      year: "2022",
      fuel: "Petrol",
      transmission: "Automatic",
      featured: true,
    },
    {
      id: "2", 
      name: "BMW 3 Series",
      price: "$38,500",
      image: car2,
      year: "2021",
      fuel: "Petrol",
      transmission: "Automatic",
    },
    {
      id: "3",
      name: "Volkswagen Golf",
      price: "$22,000",
      image: car3,
      year: "2023",
      fuel: "Petrol",
      transmission: "Manual",
    },
  ];

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
            <CarCard key={car.id} {...car} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="mr-4">
            View All Cars
          </Button>
          <Button size="lg" className="bg-automotive-blue hover:bg-automotive-blue/90">
            <Plus className="mr-2 h-5 w-5" />
            Admin: Add New Car
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CarsSection;