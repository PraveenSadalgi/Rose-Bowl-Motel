import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary/50 text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-headline text-2xl font-bold">Rose Bowl Motel</h3>
            <p className="mt-4 text-muted-foreground max-w-md">
              Experience classic elegance and warm hospitality at Rose Bowl Motel. Where tradition meets modern comfort.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-xl font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/rooms" className="text-muted-foreground hover:text-primary transition-colors">View Rooms</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Photo Gallery</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Get in Touch</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-xl font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 shrink-0 text-primary" />
                <span className="text-muted-foreground">Ellish bridge, opp. Kothawala, Pritam Nagar, Paldi, Ahmedabad, Gujarat</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">(+91) 9876543210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">info@rosebowlmotel.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Rose Bowl Motel. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
              <Facebook size={20} />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
              <Instagram size={20} />
            </Link>
            <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
              <Twitter size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
