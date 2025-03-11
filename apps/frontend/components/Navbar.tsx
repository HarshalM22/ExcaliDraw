import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import Button from './Button';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-serif text-2xl font-bold tracking-tight">
              excalidraw<span className="text-blue-500">.</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <Link href="#features" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Features
            </Link>
            <Link href="#testimonials" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Pricing
            </Link>
          </nav>
          
          {/* Call href action */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">Log in</Button>
            <Button size="sm">Sign up</Button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <span 
                className={`block h-0.5 bg-current transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'
                }`}
              ></span>
              <span 
                className={`block h-0.5 bg-current transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? 'opacity-0' : 'w-5'
                }`}
              ></span>
              <span 
                className={`block h-0.5 bg-current transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-4'
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen bg-white/95 backdrop-blur-md shadow-lg' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4 space-y-2">
          <Link 
           href="/" 
            className="block py-3 px-4 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
           href="#features" 
            className="block py-3 px-4 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
           href="#testimonials" 
            className="block py-3 px-4 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Testimonials
          </Link>
          <Link 
           href="#pricing" 
            className="block py-3 px-4 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <div className="pt-2 pb-4 px-4 flex space-x-4">
            <Button variant="outline" className="w-full justify-center">Log in</Button>
            <Button className="w-full justify-center">Sign up</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
