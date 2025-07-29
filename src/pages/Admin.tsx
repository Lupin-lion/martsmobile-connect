import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Car, Plus, LogOut, Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Car {
  id: string;
  name: string;
  price: string;
  image_url: string | null;
  year: string;
  fuel: string;
  transmission: string;
  description: string | null;
  mileage: string | null;
  engine: string | null;
  featured: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    year: "",
    fuel: "Petrol",
    transmission: "Automatic",
    description: "",
    mileage: "",
    engine: "",
    featured: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
    fetchCars();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cars",
        variant: "destructive",
      });
    } else {
      setCars(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update existing car
        const { error } = await supabase
          .from("cars")
          .update({
            name: formData.name,
            price: formData.price,
            year: formData.year,
            fuel: formData.fuel,
            transmission: formData.transmission,
            description: formData.description,
            mileage: formData.mileage,
            engine: formData.engine,
            featured: formData.featured,
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Car updated successfully!",
        });
        setEditingId(null);
      } else {
        // Add new car
        const { error } = await supabase
          .from("cars")
          .insert({
            name: formData.name,
            price: formData.price,
            year: formData.year,
            fuel: formData.fuel,
            transmission: formData.transmission,
            description: formData.description,
            mileage: formData.mileage,
            engine: formData.engine,
            featured: formData.featured,
            created_by: user.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Car added successfully!",
        });
      }

      // Reset form
      setFormData({
        name: "",
        price: "",
        year: "",
        fuel: "Petrol",
        transmission: "Automatic",
        description: "",
        mileage: "",
        engine: "",
        featured: false,
      });

      fetchCars();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car: Car) => {
    setFormData({
      name: car.name,
      price: car.price,
      year: car.year,
      fuel: car.fuel,
      transmission: car.transmission,
      description: car.description || "",
      mileage: car.mileage || "",
      engine: car.engine || "",
      featured: car.featured,
    });
    setEditingId(car.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return;

    const { error } = await supabase
      .from("cars")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete car",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Car deleted successfully!",
      });
      fetchCars();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Edit Car Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingId ? "Edit Car" : "Add New Car"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Car Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., BMW 3 Series"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., $35,000"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 2023"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    <Select value={formData.fuel} onValueChange={(value) => handleSelectChange("fuel", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Transmission</Label>
                    <Select value={formData.transmission} onValueChange={(value) => handleSelectChange("transmission", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      placeholder="e.g., 45,000 km"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engine">Engine</Label>
                    <Input
                      id="engine"
                      name="engine"
                      value={formData.engine}
                      onChange={handleInputChange}
                      placeholder="e.g., 2.0L Turbo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Car description..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="featured">Featured Car</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingId ? "Update Car" : "Add Car"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingId(null);
                      setFormData({
                        name: "",
                        price: "",
                        year: "",
                        fuel: "Petrol",
                        transmission: "Automatic",
                        description: "",
                        mileage: "",
                        engine: "",
                        featured: false,
                      });
                    }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Cars List */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Cars ({cars.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {cars.map((car) => (
                  <div key={car.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{car.name}</h3>
                        <p className="text-sm text-muted-foreground">{car.price} • {car.year}</p>
                        {car.featured && (
                          <span className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded text-xs mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(car)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(car.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {car.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>
                    )}
                  </div>
                ))}
                {cars.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No cars added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;