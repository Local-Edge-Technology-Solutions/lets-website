import LeadCaptureForm from './LeadCaptureForm';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Ready to <span className="text-gradient">Transform</span> Your Business?
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started with a free consultation. No obligations, no sales pressure—just honest advice about how AI can help your business.
          </p>
        </div>

        <LeadCaptureForm />
      </div>
    </section>
  );
}
