import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin } from 'lucide-react';
import benHeadshotImg from '@assets/ben-headshot_1762803470298.jpg';
import brianHeadshotImg from '@assets/brian-headshot_1762803470298.png';

const founders = [
  {
    name: 'Ben',
    title: 'Co-Founder & AI Strategist',
    image: benHeadshotImg,
    bio: "With over a decade in technology consulting, Ben specializes in helping small businesses identify and implement AI solutions that drive real ROI. He's passionate about making enterprise-level technology accessible to growing companies.",
    linkedin: '#',
  },
  {
    name: 'Brian',
    title: 'Co-Founder & Technical Lead',
    image: brianHeadshotImg,
    bio: 'Brian brings 15 years of software engineering experience, with deep expertise in machine learning and automation. He leads our technical implementations, ensuring every solution is robust, scalable, and tailored to client needs.',
    linkedin: '#',
  },
];

export default function FounderBios() {
  return (
    <section id="about" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Meet the <span className="text-gradient">Founders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experienced technologists dedicated to your success
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="glass-card p-8 hover-elevate transition-all duration-300 hover:-translate-y-1"
              data-testid={`founder-card-${index}`}
            >
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 mb-6 ring-4 ring-primary/30">
                  <AvatarImage src={founder.image} alt={founder.name} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold">
                    {founder.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-2xl font-bold mb-1" data-testid={`founder-name-${index}`}>{founder.name}</h3>
                <p className="text-primary font-semibold mb-4" data-testid={`founder-title-${index}`}>{founder.title}</p>
                <p className="text-muted-foreground leading-relaxed mb-6" data-testid={`founder-bio-${index}`}>
                  {founder.bio}
                </p>

                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  data-testid={`link-linkedin-${index}`}
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-sm font-medium">Connect on LinkedIn</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
