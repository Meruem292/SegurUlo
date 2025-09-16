"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, Settings, LayoutDashboard, Smartphone, BookUser } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export function AppHeader() {
  const pathname = usePathname();
  const [user] = useAuthState(auth);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/contacts", label: "Contacts", icon: BookUser },
    { href: "/devices", label: "Device Settings", icon: Smartphone },
    { href: "/settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">SegurUlo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <nav className="flex md:hidden items-center gap-2">
                 {navLinks.map((link) => (
                    <Button key={link.href} variant={pathname === link.href ? "secondary" : "ghost"} size="icon" asChild>
                        <Link href={link.href} >
                            <link.icon className="h-4 w-4" />
                            <span className="sr-only">{link.label}</span>
                        </Link>
                    </Button>
                ))}
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={user?.photoURL ?? undefined} />
                    <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.displayName ?? 'My Account'}</DropdownMenuLabel>
                 <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 {navLinks.map(link => (
                   <DropdownMenuItem key={link.href} asChild>
                     <Link href={link.href}>
                       <link.icon className="mr-2 h-4 w-4" />
                       <span>{link.label}</span>
                     </Link>
                   </DropdownMenuItem>
                 ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => auth.signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
