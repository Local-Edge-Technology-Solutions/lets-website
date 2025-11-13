import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import heroPortalImg from '@assets/hero-portal_1762803470298.png';

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-[-10%] z-0">
        <img
          src={heroPortalImg}
          alt=""
          className="w-full h-full object-cover opacity-70 animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/75 via-background/40 to-background/75" />
      </div>

      {/* Simplified Particles - Only 3 for subtle effect */}
      <div className="absolute inset-0 overflow-hidden z-[1] hidden md:block">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              animation: `float ${20 + i * 5}s infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-[2] max-w-7xl mx-auto px-8 py-24 md:py-32 text-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-7xl font-black leading-tight">
            AI That Pays
            <br />
            <span className="text-gradient">For Itself</span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Custom AI automation for small businesses. Stop losing to competitors who already adopted AI. Get enterprise capabilities without enterprise costs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={scrollToContact}
              className="glow-primary group"
              data-testid="button-hero-primary"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-background/50 backdrop-blur-lg border-primary/30"
              data-testid="button-hero-secondary"
            >
              Learn More
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 justify-center items-center pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2" data-testid="badge-satisfaction">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>100% Satisfaction Guaranteed</span>
            </div>
            <div className="flex items-center gap-2" data-testid="badge-contracts">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>No Long-Term Contracts</span>
            </div>
            <div className="flex items-center gap-2" data-testid="badge-consultation">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Free Consultation</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(100px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
