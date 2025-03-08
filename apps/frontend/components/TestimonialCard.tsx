import React from 'react';

type TestimonialCardProps = {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  delay?: string;
};

const TestimonialCard = ({ 
  quote, 
  author, 
  role, 
  company, 
  avatar, 
  delay = 'animate-delay-100'
}: TestimonialCardProps) => {
  return (
    <div className={`glass-card p-6 rounded-xl flex flex-col animate-fade-in-up ${delay}`}>
      <div className="mb-4">
        {/* Quote icon */}
        <svg 
          className="w-10 h-10 text-primary/20" 
          fill="currentColor" 
          viewBox="0 0 32 32" 
          aria-hidden="true"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>
      
      <p className="text-lg mb-6 flex-grow">{quote}</p>
      
      <div className="flex items-center">
        {avatar ? (
          <img 
            src={avatar} 
            alt={author}
            className="w-10 h-10 rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center mr-4">
            {author.charAt(0)}
          </div>
        )}
        
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-muted-foreground">{role}, {company}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
