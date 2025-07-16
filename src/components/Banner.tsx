import React, { useEffect, useRef } from 'react';

const Banner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current && contentRef.current) {
        const scrollY = window.scrollY;
        const parallaxSpeed = 0.5;
        
        // Apply parallax effect to background
        bannerRef.current.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        
        // Apply different speed to content for parallax effect
        contentRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background with parallax */}
      <div 
        ref={bannerRef}
        className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zM10 10c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 flex items-center justify-center h-full"
      >
        <div className="text-center text-white">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            Ideas
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90">
            Where all our great things begin
          </p>
        </div>
      </div>
      
      {/* Diagonal bottom edge */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-16 fill-white"
        >
          <path d="M0,0 L0,120 L1200,30 L1200,0 Z" />
        </svg>
      </div>
    </section>
  );
};

export default Banner;