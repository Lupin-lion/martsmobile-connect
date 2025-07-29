import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Phone, Menu, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        setIsAdmin(profile?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        // Check admin status when user signs in
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();
          
          setIsAdmin(profile?.role === "admin");
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button size="sm" onClick={() => navigate("/admin")}>
                    Admin Panel
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => navigate("/auth")}>
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
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