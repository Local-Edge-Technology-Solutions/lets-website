import { useEffect, useRef, useState } from 'react';
import { Search, Lightbulb, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Discovery',
    description: 'We learn how the work happens today',
  },
  {
    icon: Lightbulb,
    number: '02',
    title: 'Plan',
    description: 'We agree what to build',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Build',
    description: 'We build it and check it with you',
  },
  {
    icon: TrendingUp,
    number: '04',
    title: 'Support',
    description: 'We keep it running',
  },
];

export default function ProcessMethodology() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section ref={ref} className="py-20 bg-card/20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            How We <span className="text-gradient">Work</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From the first conversation to something running in your business
          </p>
        </div>

        {/* Timeline visualization */}
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-border hidden md:block">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-500 ${
                  index <= activeStep ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                data-testid={`process-step-${index}`}
              >
                {/* Step number indicator */}
                <div className="flex flex-col items-center mb-6">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                      index <= activeStep
                        ? 'bg-primary text-primary-foreground glow-primary scale-110'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div
                    className={`text-sm font-bold mb-2 ${
                      index <= activeStep ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Step content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
