import Navbar from "@/components/Navbar";
import { ThemeSelectorContainer } from "@/components/ThemeSelectorContainer";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ThemeSelectorContainer />
      <div className="container mx-auto py-8">
        {/* Page content */}
      </div>
    </div>
  );
}
