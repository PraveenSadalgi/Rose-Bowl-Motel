'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../ui/sheet';
import { Menu, User, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/amenities', label: 'Amenities' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/location', label: 'Location' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 16]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleBookNow = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: 'Authentication Required',
        description: 'Please sign in or sign up to book a room.',
        variant: 'destructive',
      });
      router.push('/auth/signup');
    }
  };

  return (
    <motion.header
      style={{
        backgroundColor: `rgba(255, 255, 255, ${headerOpacity.get()})`,
        backdropFilter: `blur(${headerBlur.get()}px)`,
      }}
      className="sticky top-0 z-50 w-full border-b transition-all duration-300"
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 active:opacity-80 transition-opacity"
          aria-label="Rose Bowl Motel Home"
        >
          <span className="font-headline text-xl font-bold whitespace-nowrap">Rose Bowl Motel</span>
          <p className="hidden sm:inline text-sm text-muted-foreground whitespace-nowrap">the classic elegance</p>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-headline font-medium transition-all hover:text-black hover:scale-105',
                  pathname === link.href ? 'text-black font-bold' : 'text-black/90'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {!loading && (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/signin" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/signup" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </div>
            ))}
            <Button
              asChild={user ? true : false}
              size="sm"
              className="font-extrabold text-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
              onClick={!user ? handleBookNow : undefined}
            >
              {user ? <Link href="/booking">BOOK NOW</Link> : <span>BOOK NOW</span>}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden -mr-2 flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="h-10 w-10 rounded-full flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="flex flex-col p-0 w-[300px] sm:w-[350px] overflow-hidden">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <span className="font-bold font-headline text-xl">Rose Bowl Motel</span>
                <p className="text-sm text-muted-foreground">the classic elegance</p>
              </div>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Quick Actions */}
              <div className="p-4">
                <Button
                  asChild={user ? true : false}
                  className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-base font-semibold mb-6"
                  onClick={(e) => {
                    if (!user) {
                      handleBookNow(e);
                    } else {
                      setIsOpen(false);
                    }
                  }}
                >
                  {user ? (
                    <Link href="/booking">
                      BOOK NOW
                    </Link>
                  ) : (
                    <span>BOOK NOW</span>
                  )}
                </Button>

                {/* Main Navigation */}
                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors',
                        pathname === link.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/80 hover:bg-accent/50'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* User Section */}
              <div className="border-t p-4">
                {!loading ? (
                  user ? (
                    <div className="space-y-4">
                      <p className="px-2 text-sm font-medium text-muted-foreground mb-2">My Account</p>

                      {/* User Info */}
                      <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-accent/30 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.email?.split('@')[0]}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      {/* Account Links */}
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-colors',
                            pathname === '/profile'
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground/80 hover:bg-accent/50'
                          )}
                        >
                          <User className="h-5 w-5" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/bookings"
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-colors',
                            pathname === '/bookings'
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground/80 hover:bg-accent/50'
                          )}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          <span>My Bookings</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-base text-foreground/80 hover:bg-accent/50 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="px-2 text-sm font-medium text-muted-foreground mb-2">Guest</p>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full h-12 text-base gap-2"
                      >
                        <Link
                          href="/auth/signin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center"
                        >
                          <LogIn className="h-5 w-5" />
                          Sign In
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full h-12 text-base gap-2 bg-primary hover:bg-primary/90 text-white"
                      >
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center"
                        >
                          <UserPlus className="h-5 w-5" />
                          Create Account
                        </Link>
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center py-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-4 border-t">
              <Button
                asChild={user ? true : false}
                className="w-full h-12 text-base font-semibold"
                onClick={(e) => {
                  if (!user) {
                    handleBookNow(e);
                  } else {
                    setIsOpen(false);
                  }
                }}
              >
                {user ? <Link href="/booking">BOOK NOW</Link> : <span>BOOK NOW</span>}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}
