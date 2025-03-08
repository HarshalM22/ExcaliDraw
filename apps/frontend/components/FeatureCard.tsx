import React from 'react';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: string;
};

const FeatureCard = ({ title, description, icon, delay = 'animate-delay-100' }: FeatureCardProps) => {
  return (
    <div className={`glass-card p-6 rounded-xl animate-fade-in-up ${delay}`}>
      <div className="h-12 w-12 mb-5 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
