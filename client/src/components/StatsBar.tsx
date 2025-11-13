import { useEffect, useState, useRef } from 'react';

export default function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ businesses: 0, efficiency: 0, roi: 0, satisfaction: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const targets = { businesses: 50, efficiency: 60, roi: 300, satisfaction: 100 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let current = { businesses: 0, efficiency: 0, roi: 0, satisfaction: 0 };
    const increments = {
      businesses: targets.businesses / steps,
      efficiency: targets.efficiency / steps,
      roi: targets.roi / steps,
      satisfaction: targets.satisfaction / steps,
    };

    const timer = setInterval(() => {
      current = {
        businesses: Math.min(current.businesses + increments.businesses, targets.businesses),
        efficiency: Math.min(current.efficiency + increments.efficiency, targets.efficiency),
        roi: Math.min(current.roi + increments.roi, targets.roi),
        satisfaction: Math.min(current.satisfaction + increments.satisfaction, targets.satisfaction),
      };

      setCounts({
        businesses: Math.floor(current.businesses),
        efficiency: Math.floor(current.efficiency),
        roi: Math.floor(current.roi),
        satisfaction: Math.floor(current.satisfaction),
      });

      if (
        current.businesses >= targets.businesses &&
        current.efficiency >= targets.efficiency &&
        current.roi >= targets.roi &&
        current.satisfaction >= targets.satisfaction
      ) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <div ref={ref} className="py-20 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center" data-testid="stat-businesses">
            <div className="text-5xl font-black text-primary mb-2">{counts.businesses}+</div>
            <div className="text-muted-foreground">Businesses Transformed</div>
          </div>
          <div className="text-center" data-testid="stat-efficiency">
            <div className="text-5xl font-black text-primary mb-2">{counts.efficiency}%</div>
            <div className="text-muted-foreground">Avg. Efficiency Gain</div>
          </div>
          <div className="text-center" data-testid="stat-roi">
            <div className="text-5xl font-black text-primary mb-2">{counts.roi}%</div>
            <div className="text-muted-foreground">Average ROI</div>
          </div>
          <div className="text-center" data-testid="stat-satisfaction">
            <div className="text-5xl font-black text-primary mb-2">{counts.satisfaction}%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
