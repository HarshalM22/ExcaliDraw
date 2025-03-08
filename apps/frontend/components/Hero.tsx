import React, { useRef, useEffect } from 'react';
import Button from './Button';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interactive background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(65, 84, 255, ${particle.opacity})`;
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
      });
      
      // Connect nearby particles with lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(65, 84, 255, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Interactive background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full -z-10 opacity-70"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white pointer-events-none" />
      
      <div className="container mx-auto px-4 pt-20 pb-32 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <p className="inline-flex items-center px-4 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Introducing Excalidraw — Reimagined
          </p>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-8 animate-fade-in-up">
            <span className="text-shadow">Create beautiful</span>
            <br />
            <span className="relative text-primary text-shadow">
              hand-drawn diagrams
              <svg width="100%" height="10" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-4 left-0 w-full opacity-60">
                <path d="M1 5.5C67 -0.5 134 -0.5 199 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 animate-fade-in-up animate-delay-200">
            A simple yet powerful tool for creating hand-drawn diagrams, wireframes, and illustrations for your projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up animate-delay-300">
            <Button size="lg">
              <span className="mr-2">Try it now</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
            <Button variant="outline" size="lg">
              Watch demo
            </Button>
          </div>
          
          {/* Preview Image */}
          <div className="w-full max-w-5xl mx-auto relative animate-fade-in-up animate-delay-500">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 opacity-30 animate-pulse-slow" />
            <div className="glass bg-white/50 p-1 sm:p-2 rounded-xl border border-black/5 shadow-2xl">
              <div className="rounded-lg overflow-hidden shadow-inner bg-white border border-black/5">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                  alt="Excalidraw Preview" 
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-xl rotate-12 animate-float opacity-70 hidden sm:block" />
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-100 rounded-full animate-float animate-delay-500 opacity-70 hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
