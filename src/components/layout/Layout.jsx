import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({ children }) {
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
        {children}
      </main>
      <Footer />
    </div>
  );
}
