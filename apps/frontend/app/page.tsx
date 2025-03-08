// 'use client'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     excalidraw landing page 
    </div>
  );
}

// import React, { useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import Hero from '../components/Hero';
// import Features from '../components/Features';
// import TestimonialCard from '../components/TestimonialCard';
// import Button from '../components/Button';
// import Footer from '../components/Footer';

// export default function Index () {
//   useEffect(() => {
//     // Smooth scroll to section when a nav link is clicked
//     const handleScrollToSection = (e: MouseEvent) => {
//       const target = e.target as HTMLElement;
//       const href = target.getAttribute('href');
      
//       if (href?.startsWith('#') && href !== '#') {
//         e.preventDefault();
//         const id = href.substring(1);
//         const element = document.getElementById(id);
        
//         if (element) {
//           element.scrollIntoView({
//             behavior: 'smooth',
//             block: 'start',
//           });
//         }
//       }
//     };
    
//     // Add click event listeners to all anchor links
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//       anchor.addEventListener('click', handleScrollToSection as any);
//     });
    
//     return () => {
//       document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.removeEventListener('click', handleScrollToSection as any);
//       });
//     };
//   }, []);
  
//   const testimonials = [
//     {
//       quote: "Excalidraw has transformed how our team communicates ideas. It's intuitive, fast, and the hand-drawn feel makes our diagrams more approachable.",
//       author: "Sarah Johnson",
//       role: "Product Manager",
//       company: "Atlassian",
//       delay: "animate-delay-100"
//     },
//     {
//       quote: "As a UX designer, I need to create wireframes quickly. Excalidraw is my go-to tool for early-stage designs and sharing concepts with stakeholders.",
//       author: "Michael Chen",
//       role: "UX Designer",
//       company: "Figma",
//       delay: "animate-delay-300"
//     },
//     {
//       quote: "The collaboration features are game-changing. Multiple team members can work on the same diagram in real-time, which has made our remote work so much easier.",
//       author: "Emily Rodriguez",
//       role: "Engineering Lead",
//       company: "Shopify",
//       delay: "animate-delay-500"
//     }
//   ];
  
//   const pricingTiers = [
//     {
//       name: "Free",
//       price: "$0",
//       description: "Perfect for individuals and small projects",
//       features: [
//         "Unlimited diagrams",
//         "Basic shape library",
//         "PNG export",
//         "1 collaborator"
//       ],
//       cta: "Get Started",
//       delay: "animate-delay-100"
//     },
//     {
//       name: "Pro",
//       price: "$12",
//       period: "/month",
//       description: "For professionals and growing teams",
//       features: [
//         "Everything in Free",
//         "Advanced shape library",
//         "SVG and PDF export",
//         "Up to 5 collaborators",
//         "Version history"
//       ],
//       cta: "Start 14-day Trial",
//       delay: "animate-delay-300",
//       popular: true
//     },
//     {
//       name: "Team",
//       price: "$49",
//       period: "/month",
//       description: "For organizations and larger teams",
//       features: [
//         "Everything in Pro",
//         "Unlimited collaborators",
//         "Team libraries",
//         "Advanced permissions",
//         "SSO Authentication",
//         "Dedicated support"
//       ],
//       cta: "Contact Sales",
//       delay: "animate-delay-500"
//     }
//   ];
  
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main>
//         <Hero />
//         <Features />
        
//         {/* Testimonials Section */}
//         <section id="testimonials" className="py-24 relative overflow-hidden bg-slate-50">
//           <div className="container mx-auto px-4">
//             <div className="text-center max-w-3xl mx-auto mb-16">
//               <p className="text-primary font-medium mb-3 animate-fade-in">Testimonials</p>
//               <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 animate-fade-in-up">
//                 Loved by teams worldwide
//               </h2>
//               <p className="text-lg text-muted-foreground animate-fade-in-up animate-delay-200">
//                 Hear what our users have to say about their experience with Excalidraw.
//               </p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//               {testimonials.map((testimonial, index) => (
//                 <TestimonialCard
//                   key={index}
//                   quote={testimonial.quote}
//                   author={testimonial.author}
//                   role={testimonial.role}
//                   company={testimonial.company}
//                   delay={testimonial.delay}
//                 />
//               ))}
//             </div>
            
//             {/* Stats */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
//               {[
//                 { number: "100K+", label: "Active Users" },
//                 { number: "5M+", label: "Diagrams Created" },
//                 { number: "98%", label: "Satisfaction" },
//                 { number: "150+", label: "Countries" }
//               ].map((stat, index) => (
//                 <div 
//                   key={index} 
//                   className={`text-center p-6 animate-fade-in-up animate-delay-${(index + 1) * 200}`}
//                 >
//                   <p className="text-3xl md:text-4xl font-bold font-serif mb-2">{stat.number}</p>
//                   <p className="text-muted-foreground">{stat.label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
        
//         {/* Pricing Section */}
//         <section id="pricing" className="py-24 relative overflow-hidden bg-mesh">
//           <div className="container mx-auto px-4">
//             <div className="text-center max-w-3xl mx-auto mb-16">
//               <p className="text-primary font-medium mb-3 animate-fade-in">Pricing</p>
//               <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 animate-fade-in-up">
//                 Simple, transparent pricing
//               </h2>
//               <p className="text-lg text-muted-foreground animate-fade-in-up animate-delay-200">
//                 Choose the plan that works best for you or your team. All plans include a 14-day trial.
//               </p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//               {pricingTiers.map((tier, index) => (
//                 <div 
//                   key={index} 
//                   className={`glass-card rounded-xl overflow-hidden flex flex-col ${tier.delay} relative ${
//                     tier.popular ? 'md:scale-105 md:shadow-xl z-10' : ''
//                   }`}
//                 >
//                   {tier.popular && (
//                     <div className="absolute top-0 right-0">
//                       <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
//                         Most Popular
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="p-6 border-b border-gray-100">
//                     <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
//                     <div className="flex items-end mb-4">
//                       <span className="text-4xl font-bold">{tier.price}</span>
//                       {tier.period && (
//                         <span className="text-muted-foreground ml-1">{tier.period}</span>
//                       )}
//                     </div>
//                     <p className="text-muted-foreground">{tier.description}</p>
//                   </div>
                  
//                   <div className="p-6 flex-grow">
//                     <ul className="space-y-3 mb-8">
//                       {tier.features.map((feature, i) => (
//                         <li key={i} className="flex items-start">
//                           <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center mr-3">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </span>
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
                  
//                   <div className="p-6 pt-0">
//                     <Button 
//                       className={`w-full ${tier.popular ? '' : 'variant-outline'}`}
//                       variant={tier.popular ? 'primary' : 'outline'}
//                     >
//                       {tier.cta}
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="mt-16 text-center">
//               <p className="text-muted-foreground mb-6">
//                 Need a custom plan for your enterprise? We've got you covered.
//               </p>
//               <Button variant="outline">Contact Sales</Button>
//             </div>
//           </div>
//         </section>
        
//         {/* Call to Action */}
//         <section className="py-24 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 -z-10" />
          
//           <div className="container mx-auto px-4 text-center max-w-3xl">
//             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 animate-fade-in-up">
//               Ready to create beautiful diagrams?
//             </h2>
//             <p className="text-lg text-muted-foreground mb-10 animate-fade-in-up animate-delay-200">
//               Join thousands of teams who are already using Excalidraw to bring their ideas to life.
//             </p>
//             <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animate-delay-300">
//               <Button size="lg">
//                 Get Started for Free
//               </Button>
//               <Button variant="outline" size="lg">
//                 Watch Demo
//               </Button>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// };


