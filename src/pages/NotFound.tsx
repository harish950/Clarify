import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-nebula flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />
      
      <div className="text-center relative z-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 glow-primary">
          <Sparkles className="w-10 h-10" />
        </div>
        <h1 className="font-display text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          This career path doesn't exist... yet.
        </p>
        <Link to="/">
          <Button variant="glow" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Return to Universe
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
