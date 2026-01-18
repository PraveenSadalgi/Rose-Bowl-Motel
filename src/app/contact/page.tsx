import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import PageHeader from '@/components/PageHeader';
import { Mail, Phone, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Rose Bowl Motel.',
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Get In Touch"
        subtitle="We're here to help with any questions or inquiries. Reach out to us, and we'll be happy to assist you."
      />
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="view-animation">
            <h2 className="font-headline text-3xl mb-6">Contact Information</h2>
            <div className="space-y-6 text-lg">
                <div className='flex items-start gap-4'>
                    <Phone className="w-6 h-6 mt-1 text-primary"/>
                    <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p className="text-muted-foreground">(123) 456-7890</p>
                    </div>
                </div>
                 <div className='flex items-start gap-4'>
                    <Mail className="w-6 h-6 mt-1 text-primary"/>
                    <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-muted-foreground">contact@rosebowlmotel.com</p>
                    </div>
                </div>
                 <div className='flex items-start gap-4'>
                    <Clock className="w-6 h-6 mt-1 text-primary"/>
                    <div>
                        <h3 className="font-semibold">Hours</h3>
                        <p className="text-muted-foreground">Open 24/7 for our guests</p>
                    </div>
                </div>
            </div>
          </div>
          <div className="view-animation" style={{animationDelay: '200ms'}}>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
