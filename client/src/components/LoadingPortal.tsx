import { useEffect, useState } from 'react';

export default function LoadingPortal() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background z-[10000] flex items-center justify-center transition-opacity duration-500" style={{ opacity: isVisible ? 1 : 0 }}>
      <div className="relative">
        <div className="w-48 h-48 border-4 border-primary rounded-xl animate-[spin_2s_ease_forwards] glow-primary-lg" />
        <div className="absolute inset-[10px] bg-gradient-to-br from-transparent to-primary/50 rounded-lg animate-pulse" />
      </div>
      <div className="absolute bottom-12 text-primary font-semibold tracking-[0.2em] animate-pulse">
        LOADING
      </div>
    </div>
  );
}
