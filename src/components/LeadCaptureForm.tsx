import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, Loader2, Gift, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const challenges = [
  'Customer service taking too much time',
  'Manual data entry and paperwork',
  'Inventory management issues',
  'Sales forecasting and analytics',
  'Marketing automation',
  'Other / Not sure yet',
];

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    email: '',
    challenge: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Remove mock functionality - Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form submitted:', formData);

    setIsSubmitting(false);
    setIsSuccess(true);
    toast({
      title: "You are in! Check your email",
      description: 'Your custom AI roadmap is on its way.',
    });

    setTimeout(() => {
      setFormData({ email: '', challenge: '' });
      setIsSuccess(false);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="glass-card p-12 text-center space-y-6 animate-in fade-in duration-500" data-testid="form-success">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h3 className="text-3xl font-bold mb-2">Check Your Inbox!</h3>
          <p className="text-lg text-muted-foreground">
            We've sent your custom AI roadmap to <span className="text-foreground font-semibold">{formData.email}</span>
          </p>
        </div>
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-center gap-3 text-sm">
            <Clock className="w-5 h-5 text-primary" />
            <span>We'll follow up within 24 hours to schedule your free consultation</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6" data-testid="form-lead-capture">
      {/* Value Preview */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
        <div className="flex items-start gap-3">
          <Gift className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground mb-1">Get Your Free AI Roadmap</p>
            <p className="text-sm text-muted-foreground">
              Customized automation opportunities + ROI estimates for your specific business
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Work Email <span className="text-destructive">*</span>
        </label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@company.com"
          className="bg-background/50 border-primary/30 focus:border-primary focus:ring-primary"
          data-testid="input-email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="challenge" className="text-sm font-semibold">
          What's your biggest AI challenge? <span className="text-destructive">*</span>
        </label>
        <Select
          required
          value={formData.challenge}
          onValueChange={(value) => setFormData({ ...formData, challenge: value })}
        >
          <SelectTrigger 
            className="bg-background/50 border-primary/30 focus:border-primary focus:ring-primary"
            data-testid="select-challenge"
          >
            <SelectValue placeholder="Select your primary challenge..." />
          </SelectTrigger>
          <SelectContent>
            {challenges.map((challenge, index) => (
              <SelectItem key={index} value={challenge} data-testid={`option-challenge-${index}`}>
                {challenge}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full glow-primary"
        data-testid="button-submit"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Your Roadmap...
          </>
        ) : (
          <>
            <Gift className="mr-2 h-5 w-5" />
            Get My Free AI Roadmap
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          No spam, ever
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Response in 24hrs
        </span>
      </div>
    </form>
  );
}
