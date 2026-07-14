import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* WCAG Skip Link */}
      <a
        href="#main-content"
        className="
          absolute top-0 left-0 m-2 px-4 py-2 rounded 
          bg-white text-primary font-medium 
          focus-ring 
          opacity-0 focus:opacity-100 
          pointer-events-none focus:pointer-events-auto
          transition-opacity
        "
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
