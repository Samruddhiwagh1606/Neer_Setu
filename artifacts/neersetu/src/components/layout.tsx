import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Droplet, Menu, X, User as UserIcon, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import ChatBot from "./chat-bot";

export function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/awareness", label: "Awareness" },
    { href: "/videos", label: "Learn" },
    { href: "/systems", label: "Systems" },
    { href: "/schemes", label: "Schemes" },
    { href: "/providers", label: "Providers" },
  ];

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "user") return "/dashboard/user";
    if (user.role === "provider") return "/dashboard/provider";
    return "/dashboard/ngo";
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Droplet className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                Neer<span className="text-primary">Setu</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <Link href={getDashboardLink()} className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-secondary" />
                    </div>
                    <span>{user.name}</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                    Login / Register
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/5 text-primary font-medium"
                    >
                      <span>Dashboard ({user.role})</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Button variant="outline" className="w-full justify-start text-destructive" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full rounded-xl">Login / Register</Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Droplet className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-xl tracking-tight">NeerSetu</span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Making rainwater harvesting affordable and accessible for every home in India. Connecting you with verified providers, NGOs, and government schemes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-6">Quick Links</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/awareness" className="hover:text-primary transition-colors">Awareness</Link></li>
                <li><Link href="/systems" className="hover:text-primary transition-colors">Affordable Systems</Link></li>
                <li><Link href="/schemes" className="hover:text-primary transition-colors">Govt Schemes</Link></li>
                <li><Link href="/providers" className="hover:text-primary transition-colors">Find Providers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-6">Legal & Terms</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/provider-guidelines" className="hover:text-primary transition-colors">Provider Guidelines</Link></li>
                <li><Link href="/ngo-partnership" className="hover:text-primary transition-colors">NGO Partnership</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} NeerSetu. All rights reserved.</p>
            <p className="mt-4 md:mt-0 flex items-center">
              Built for a sustainable India <Droplet className="w-3 h-3 text-primary ml-1 fill-primary" />
            </p>
          </div>
        </div>
      </footer>

      {/* Floating ChatBot */}
      <ChatBot />
    </div>
  );
}
