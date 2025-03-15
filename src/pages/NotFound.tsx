
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md animate-scale-in">
        <div className="bg-muted rounded-full size-20 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="size-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-medium mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! We couldn't find this page
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-event to-task hover:opacity-90 rounded-full px-8">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
