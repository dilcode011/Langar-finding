'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, HelpCircle, Mail, Shield, MapPin, Utensils, Bell, Star, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function HelpPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    const { error } = await supabase.from('app_reviews').insert({
      user_id: user?.id || null,
      rating,
      feedback: feedback.trim() || null
    });
    setSubmitting(false);

    if (error) {
      toast.error('Failed to submit review');
    } else {
      setSubmitted(true);
      toast.success('Thank you for your feedback!');
    }
  };

  const faqs = [
    { q: 'What is Langar Finder?', a: 'Langar Finder is a community-driven website to discover, add, and share free community meal (langar) locations at Gurudwaras and other venues across Punjab, Delhi, and beyond.' },
    { q: 'How do I add a langar?', a: 'Click "Add Langar" in the navigation, sign in, and fill out the form with the venue name, location, timing, and food details. Your submission will be reviewed by our admin team before appearing publicly.' },
    { q: 'Why does my listing say "Unverified"?', a: 'All new listings are published immediately with an "Unverified" label. An admin can verify your listing later to add the blue check badge, which confirms the listing is accurate and trustworthy.' },
    { q: 'How do I search for langar near me?', a: 'Use the search bar on the home page and click "Use my location", or go to the Map view and click the "My Location" button to find langars near your current position.' },
    { q: 'Can I save langars for later?', a: 'Yes! Sign in, go to any langar detail page, and click the "Save" button. Saved langars appear in your Dashboard under the "Saved Langars" tab.' },
    { q: 'How do I report an incorrect listing?', a: 'Go to the langar detail page, scroll to the sidebar, and click "Report Listing". Describe what\'s wrong and our team will review it.' },
    { q: 'Is Langar Finder free to use?', a: 'Yes, Langar Finder is completely free. Langar itself is a Sikh tradition of free community meals open to everyone regardless of background.' },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-3xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden shadow-sm">
          <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-sm text-muted-foreground">Frequently asked questions and support</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-base">{faq.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-primary-100 shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary-50 h-12 w-12 rounded-full flex items-center justify-center mb-2">
            <MessageSquare className="h-6 w-6 text-primary-500" />
          </div>
          <CardTitle>Leave a Review</CardTitle>
          <CardDescription>Tell us how we're doing or suggest a feature!</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
              <h3 className="text-lg font-medium">Thank you!</h3>
              <p className="text-sm text-muted-foreground">Your review has been successfully submitted.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-sm font-medium">Rate your experience</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          (hoverRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Tell us what you love or what could be improved... (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button 
                onClick={handleSubmitReview} 
                className="w-full" 
                disabled={submitting || rating === 0}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
