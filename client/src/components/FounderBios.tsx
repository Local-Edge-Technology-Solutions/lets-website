import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import benHeadshotImg from '@assets/ben-headshot_1762803470298.jpg';
import brianHeadshotImg from '@assets/brian-headshot_1762803470298.png';

const founders = [
  {
    name: 'Ben',
    title: 'Co-founder',
    image: benHeadshotImg,
  },
  {
    name: 'Brian',
    title: 'Co-founder',
    image: brianHeadshotImg,
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
            The people you'll work with
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
                <p className="text-primary font-semibold" data-testid={`founder-title-${index}`}>{founder.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
