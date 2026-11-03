import LeadCaptureForm from './LeadCaptureForm';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Tell Us What <span className="text-gradient">You Need</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Tell us what you need and we'll get back to you. No obligation, no sales pressure.
          </p>
        </div>

        <LeadCaptureForm />
      </div>
    </section>
  );
}
