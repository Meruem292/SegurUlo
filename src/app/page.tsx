import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  HeartPulse,
  Smartphone,
  Star,
  Zap,
  Cog,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container fixed top-0 left-1/2 -translate-x-1/2 z-50 mx-auto flex h-20 items-center justify-between px-4 md:px-6 text-white">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold">SegurUlo</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline transition-colors"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:underline transition-colors"
            prefetch={false}
          >
            Testimonials
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Button variant="outline" className="bg-transparent text-white hover:bg-white hover:text-black" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="bg-white text-black hover:bg-white/90">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative h-[80vh] w-full flex items-center justify-center">
          <Image
            src="https://picsum.photos/1920/1080"
            alt="SegurUlo Smart Helmet"
            fill
            style={{ objectFit: 'cover' }}
            className="-z-10 brightness-50"
            data-ai-hint="cycling helmet night"
          />
          <div className="container mx-auto px-4 text-center text-white md:px-6">
              <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Protect Your Journey, Connect Your World
                </h1>
                <p className="mt-4 text-lg text-neutral-200 md:text-xl">
                  SegurUlo is the smart helmet that keeps you safe and connected on
                  every ride. Experience the future of cycling safety.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" asChild className="bg-white text-black hover:bg-white/90">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-transparent text-white hover:bg-white hover:text-black">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
          </div>
        </section>
        <section id="features" className="bg-muted/30 py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Features That Matter
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Packed with technology to enhance your safety and riding
                experience.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Emergency Alerts</h3>
                <p className="mt-2 text-muted-foreground">
                  Automatic incident detection and manual alerts notify your
                  emergency contacts.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Cog className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Personalization</h3>
                <p className="mt-2 text-muted-foreground">
                  Let our AI tailor your helmet's settings for comfort and
                  safety based on your riding style.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Seamless Connectivity</h3>
                <p className="mt-2 text-muted-foreground">
                  Stay connected with real-time status updates and easy
                  management through our mobile app.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Loved by Riders Everywhere
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Don't just take our word for it. Here's what our users have to
                say.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                  </div>
                  <p className="text-muted-foreground">
                    "The peace of mind SegurUlo gives me is priceless. My family
                    feels better knowing I'm protected by the emergency alert
                    system."
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Jane Doe</p>
                      <p className="text-sm text-muted-foreground">
                        Daily Commuter
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                  </div>
                  <p className="text-muted-foreground">
                    "I love the personalized settings. The AI figured out the
                    perfect ventilation for my long weekend rides. It's a game
                    changer!"
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Mike Smith</p>
                      <p className="text-sm text-muted-foreground">
                        Mountain Biker
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                    <Star className="w-5 h-5 fill-accent stroke-accent" />
                  </div>
                  <p className="text-muted-foreground">
                    "Sleek design, comfortable fit, and top-notch technology.
                    SegurUlo is the best helmet I've ever owned. Highly
                    recommend!"
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>CF</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Carlos Fernandez</p>
                      <p className="text-sm text-muted-foreground">
                        Road Cyclist
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted/30">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-lg font-semibold">SegurUlo</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 SegurUlo Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
              prefetch={false}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
              prefetch={false}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}