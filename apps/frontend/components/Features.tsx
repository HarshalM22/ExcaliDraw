import React from 'react';
import FeatureCard from './FeatureCard';

const Features = () => {
  const features = [
    {
      title: "Sketch Anywhere",
      description: "Create beautiful diagrams from any device with our responsive interface. No downloads needed.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      delay: "100"
    },
    {
      title: "Collaborate in Real-time",
      description: "Work together with your team in real-time. See changes as they happen and never lose your work.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      delay: "animate-delay-200"
    },
    {
      title: "Export Anywhere",
      description: "Export your diagrams as PNG, SVG, or PDF to use in presentations, documents, or websites.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      delay: "animate-delay-300"
    },
    {
      title: "Library of Elements",
      description: "Choose from our extensive library of shapes, arrows, and icons to create professional diagrams quickly.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      delay: "animate-delay-400"
    },
    {
      title: "Custom Styles",
      description: "Personalize your diagrams with custom colors, fonts, and styles to match your brand.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      delay: "animate-delay-500"
    },
    {
      title: "Privacy First",
      description: "Your data stays on your device. We don't store or track your diagrams unless you choose to save them.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      delay: "animate-delay-600"
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-mesh">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary font-medium mb-3 animate-fade-in">Features</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 animate-fade-in-up">Everything you need to create amazing diagrams</h2>
          <p className="text-lg text-muted-foreground animate-fade-in-up animate-delay-200">
            Powerful features that make diagram creation simple, intuitive, and collaborative.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={feature.delay}
            />
          ))}
        </div>
        
        {/* Feature Highlight */}
        <div className="mt-24 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl blur-3xl opacity-50 -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 animate-fade-in-left">
              <h3 className="text-3xl font-serif font-bold mb-6">Real-time collaboration with your team</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Work together with your team in real-time. See changes as they happen, comment on specific parts, and never worry about version conflicts again.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Invite team members with a simple link",
                  "See who's currently viewing and editing",
                  "Comment and provide feedback directly on the diagram",
                  "Track changes and history"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="order-1 lg:order-2 glass-card p-4 rounded-xl animate-fade-in-right">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Collaboration Feature" 
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
