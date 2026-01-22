'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../ui/sheet';
import { Menu, User, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-headline text-xl font-bold">Rose Bowl Motel</span>
          <p className="text-sm text-muted-foreground">the classic elegance</p>
        </Link>

        <div className="hidden md:flex items-center gap-8 ml-auto">
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
              asChild 
              size="sm" 
              className="font-extrabold text-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
            >
              <Link href="/booking">BOOK NOW</Link>
            </Button>
          </div>

        <div className="md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <span className="font-bold font-headline text-xl">Rose Bowl Motel</span>
                    <p className="text-sm text-muted-foreground">the classic elegance</p>
                  </div>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </div>
                
                <div className="flex-1 overflow-y-auto py-2">
                  <nav className="space-y-1 px-4">
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

                  {!loading && (
                    <div className="px-4 py-4 border-t mt-2">
                      {user ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="px-4 text-sm font-medium text-muted-foreground">My Account</p>
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
                            <button
                              onClick={() => {
                                handleSignOut();
                                setIsOpen(false);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-base text-foreground/80 hover:bg-accent/50 rounded-lg transition-colors text-left"
                            >
                              <LogOut className="h-5 w-5 text-destructive" />
                              <span className="text-destructive">Sign Out</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="px-4 text-sm font-medium text-muted-foreground">Account</p>
                          <div className="space-y-2">
                            <Button
                              asChild
                              variant="outline"
                              className="w-full justify-start gap-2 h-11 text-base"
                              onClick={() => setIsOpen(false)}
                            >
                              <Link href="/auth/signin">
                                <LogIn className="h-4 w-4" />
                                <span>Sign In</span>
                              </Link>
                            </Button>
                            <Button
                              asChild
                              className="w-full justify-start gap-2 h-11 text-base"
                              onClick={() => setIsOpen(false)}
                            >
                              <Link href="/auth/signup">
                                <UserPlus className="h-4 w-4" />
                                <span>Create Account</span>
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t">
                  <Button 
                    asChild 
                    className="w-full h-11 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/booking">BOOK NOW</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </header>
  );
}
