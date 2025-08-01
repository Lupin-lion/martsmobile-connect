import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Car, Plus, Edit2, Trash2, LogOut, Users, Eye, Star } from "lucide-react";

interface Car {
  id: string;
  name: string;
  price: string;
  main_image_url: string | null;
  image_1_url: string | null;
  image_2_url: string | null;
  image_3_url: string | null;
  image_4_url: string | null;
  image_5_url: string | null;
  year: string;
  fuel: string;
  transmission: string;
  description: string | null;
  mileage: string | null;
  engine: string | null;
  featured: boolean;
}

interface SatisfiedCustomer {
  id?: string;
  name: string;
  review: string;
  rating: number;
  image_url?: string;
  featured?: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [satisfiedCustomers, setSatisfiedCustomers] = useState<SatisfiedCustomer[]>([]);
  const [carViews, setCarViews] = useState<{[key: string]: number}>({});
  const [activeTab, setActiveTab] = useState<'cars' | 'customers' | 'analytics'>('cars');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
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

  const [customerFormData, setCustomerFormData] = useState<SatisfiedCustomer>({
    name: "",
    review: "",
    rating: 5,
    image_url: "",
    featured: false,
  });

  const [imageUrls, setImageUrls] = useState<string[]>(["", "", "", "", ""]);

  useEffect(() => {
    checkUser();
    fetchCars();
    fetchSatisfiedCustomers();
    fetchCarViews();
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

  const fetchSatisfiedCustomers = async () => {
    try {
      // @ts-ignore - New table not yet in types
      const { data, error } = await supabase
        .from("satisfied_customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      // @ts-ignore - Type will be correct after migration
      setSatisfiedCustomers(data || []);
    } catch (error) {
      console.error("Error fetching satisfied customers:", error);
    }
  };

  const fetchCarViews = async () => {
    try {
      // @ts-ignore - New table not yet in types
      const { data, error } = await supabase
        .from("car_views")
        .select("car_id")
        .order("viewed_at", { ascending: false });

      if (error) throw error;
      
      // Count views per car
      const viewCounts: {[key: string]: number} = {};
      data?.forEach((view: any) => {
        viewCounts[view.car_id] = (viewCounts[view.car_id] || 0) + 1;
      });
      setCarViews(viewCounts);
    } catch (error) {
      console.error("Error fetching car views:", error);
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

  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerFormData({
      ...customerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomerRatingChange = (value: string) => {
    setCustomerFormData({ ...customerFormData, rating: parseInt(value) });
  };

  const handleCustomerSwitchChange = (checked: boolean) => {
    setCustomerFormData({ ...customerFormData, featured: checked });
  };

  const handleImageUpload = async (file: File, index: number): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `car-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await handleImageUpload(file, index);
    if (uploadedUrl) {
      const newUrls = [...imageUrls];
      newUrls[index] = uploadedUrl;
      setImageUrls(newUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId && activeTab === 'cars') {
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
            main_image_url: imageUrls[0] || null,
            image_1_url: imageUrls[1] || null,
            image_2_url: imageUrls[2] || null,
            image_3_url: imageUrls[3] || null,
            image_4_url: imageUrls[4] || null,
            image_5_url: imageUrls[0] || null,
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
            main_image_url: imageUrls[0] || null,
            image_1_url: imageUrls[1] || null,
            image_2_url: imageUrls[2] || null,
            image_3_url: imageUrls[3] || null,
            image_4_url: imageUrls[4] || null,
            image_5_url: imageUrls[0] || null,
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
      setImageUrls(["", "", "", "", ""]);
      setIsEditing(false);

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

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId && activeTab === 'customers') {
        // Update existing customer
        // @ts-ignore - New table not yet in types
        const { error } = await supabase
          .from("satisfied_customers")
          .update(customerFormData)
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Customer updated successfully!",
        });
      } else {
        // Add new customer
        // @ts-ignore - New table not yet in types
        const { error } = await supabase
          .from("satisfied_customers")
          .insert(customerFormData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Customer added successfully!",
        });
      }

      // Reset form
      setCustomerFormData({
        name: "",
        review: "",
        rating: 5,
        image_url: "",
        featured: false,
      });
      setIsEditing(false);
      setEditingId(null);
      fetchSatisfiedCustomers();
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
    setImageUrls([
      car.main_image_url || "",
      car.image_1_url || "",
      car.image_2_url || "",
      car.image_3_url || "",
      car.image_4_url || "",
    ]);
    setEditingId(car.id);
    setIsEditing(true);
  };

  const handleCustomerEdit = (customer: SatisfiedCustomer) => {
    setCustomerFormData(customer);
    setEditingId(customer.id || null);
    setIsEditing(true);
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

  const handleCustomerDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        // @ts-ignore - New table not yet in types
        const { error } = await supabase
          .from("satisfied_customers")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Customer deleted successfully!",
        });

        fetchSatisfiedCustomers();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
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
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === 'cars' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cars')}
            className="flex items-center gap-2"
          >
            <Car className="h-4 w-4" />
            Cars
          </Button>
          <Button
            variant={activeTab === 'customers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('customers')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Satisfied Customers
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('analytics')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Car Views
          </Button>
        </div>

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add/Edit Car Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {isEditing ? "Edit Car" : "Add New Car"}
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

                  <div className="space-y-4">
                    <Label>Car Images (5 slots)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div key={index} className="space-y-2">
                          <Label htmlFor={`image-${index}`}>
                            {index === 0 ? "Main Image" : `Image ${index + 1}`}
                          </Label>
                          <Input
                            id={`image-${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, index)}
                            className="cursor-pointer"
                          />
                          {imageUrls[index] && (
                            <div className="relative">
                              <img
                                src={imageUrls[index]}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
                      {loading ? "Saving..." : isEditing ? "Update Car" : "Add Car"}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={() => {
                        setEditingId(null);
                        setIsEditing(false);
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
                        setImageUrls(["", "", "", "", ""]);
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
                        <div className="flex gap-3">
                          {car.main_image_url && (
                            <img 
                              src={car.main_image_url} 
                              alt={car.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold">{car.name}</h3>
                            <p className="text-sm text-muted-foreground">{car.price} • {car.year}</p>
                            <p className="text-xs text-muted-foreground">Views: {carViews[car.id] || 0}</p>
                            {car.featured && (
                              <span className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded text-xs mt-1">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(car)}>
                            <Edit2 className="h-4 w-4" />
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
        )}

        {/* Satisfied Customers Tab */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add/Edit Customer Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {isEditing ? "Edit Customer" : "Add Satisfied Customer"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input
                      id="customer-name"
                      name="name"
                      value={customerFormData.name}
                      onChange={handleCustomerInputChange}
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-review">Review</Label>
                    <Textarea
                      id="customer-review"
                      name="review"
                      value={customerFormData.review}
                      onChange={handleCustomerInputChange}
                      placeholder="Customer review..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <Select value={customerFormData.rating.toString()} onValueChange={handleCustomerRatingChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-image">Image URL (optional)</Label>
                    <Input
                      id="customer-image"
                      name="image_url"
                      value={customerFormData.image_url}
                      onChange={handleCustomerInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="customer-featured"
                      checked={customerFormData.featured}
                      onCheckedChange={handleCustomerSwitchChange}
                    />
                    <Label htmlFor="customer-featured">Featured Customer</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : isEditing ? "Update Customer" : "Add Customer"}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={() => {
                        setEditingId(null);
                        setIsEditing(false);
                        setCustomerFormData({
                          name: "",
                          review: "",
                          rating: 5,
                          image_url: "",
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

            {/* Customers List */}
            <Card>
              <CardHeader>
                <CardTitle>Manage Customers ({satisfiedCustomers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {satisfiedCustomers.map((customer) => (
                    <div key={customer.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          {customer.image_url && (
                            <img 
                              src={customer.image_url} 
                              alt={customer.name}
                              className="w-12 h-12 object-cover rounded-full"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold">{customer.name}</h3>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: customer.rating }, (_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            {customer.featured && (
                              <span className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded text-xs mt-1">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleCustomerEdit(customer)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleCustomerDelete(customer.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{customer.review}</p>
                    </div>
                  ))}
                  {satisfiedCustomers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No customers added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Car Views Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cars.map((car) => (
                    <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {car.main_image_url && (
                          <img 
                            src={car.main_image_url} 
                            alt={car.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold">{car.name}</h3>
                          <p className="text-sm text-muted-foreground">{car.price} • {car.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{carViews[car.id] || 0} views</span>
                      </div>
                    </div>
                  ))}
                  {cars.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No cars to show analytics for.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;