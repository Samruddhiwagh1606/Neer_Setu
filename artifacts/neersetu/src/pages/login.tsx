import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Droplet, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"user" | "provider" | "ngo">("user");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [regData, setRegData] = useState({
    name: "", email: "", password: "",
    location: "", phone: "", serviceArea: "", organizationName: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({ title: "Missing fields", description: "Please enter email and password.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(loginData.email, loginData.password);
      setLoading(false);
      if (result.success) {
        const user = JSON.parse(localStorage.getItem("neersetu_user") || "{}");
        toast({ title: "Welcome back!", description: "Logged in successfully." });
        setLocation(`/dashboard/${user.role}`);
      } else {
        toast({ title: "Login failed", description: result.error, variant: "destructive" });
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      toast({ title: "Missing fields", description: "Name, email and password are required.", variant: "destructive" });
      return;
    }
    if (regData.password.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = register({ ...regData, role });
      setLoading(false);
      if (result.success) {
        toast({ title: "Account created!", description: "Welcome to NeerSetu." });
        setLocation(`/dashboard/${role}`);
      } else {
        toast({ title: "Registration failed", description: result.error, variant: "destructive" });
      }
    }, 400);
  };

  return (
    <div className="min-h-[90vh] flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Droplet className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl">Neer<span className="text-primary">Setu</span></span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              {tab === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {tab === "login" ? "Sign in to access your dashboard." : "Join the movement to save water."}
            </p>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex mb-6">
            {(["login", "register"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${tab === t ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input value={loginData.email} onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))}
                  placeholder="you@example.com" type="email" className="bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <div className="relative">
                  <Input value={loginData.password} onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
                    type={showPw ? "text" : "password"} placeholder="••••••••" className="bg-white pr-10" />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full rounded-xl py-6 text-base mt-2" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </Button>
              <p className="text-center text-sm text-muted-foreground pt-2">
                Don't have an account?{" "}
                <button type="button" onClick={() => setTab("register")} className="text-primary font-medium hover:underline">Register</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex gap-2 mb-2">
                {(["user", "provider", "ngo"] as const).map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex-1 py-2 border rounded-xl text-sm font-medium transition-colors capitalize ${role === r ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input value={regData.name} onChange={e => setRegData(d => ({ ...d, name: e.target.value }))}
                  placeholder="Rahul Sharma" className="bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input value={regData.email} onChange={e => setRegData(d => ({ ...d, email: e.target.value }))}
                  placeholder="you@example.com" type="email" className="bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <Input value={regData.password} onChange={e => setRegData(d => ({ ...d, password: e.target.value }))}
                  type="password" placeholder="••••••••" className="bg-white" />
              </div>
              {role === "user" && (
                <div>
                  <label className="text-sm font-medium mb-1 block">City / Location</label>
                  <Input value={regData.location} onChange={e => setRegData(d => ({ ...d, location: e.target.value }))}
                    placeholder="Mumbai, Maharashtra" className="bg-white" />
                </div>
              )}
              {role === "provider" && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone Number</label>
                    <Input value={regData.phone} onChange={e => setRegData(d => ({ ...d, phone: e.target.value }))}
                      placeholder="98765 43210" className="bg-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Service Area</label>
                    <Input value={regData.serviceArea} onChange={e => setRegData(d => ({ ...d, serviceArea: e.target.value }))}
                      placeholder="South Bangalore, Mysore" className="bg-white" />
                  </div>
                </>
              )}
              {role === "ngo" && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Organisation Name</label>
                  <Input value={regData.organizationName} onChange={e => setRegData(d => ({ ...d, organizationName: e.target.value }))}
                    placeholder="Green Earth Foundation" className="bg-white" />
                </div>
              )}
              <Button type="submit" className="w-full rounded-xl py-6 text-base" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </Button>
              <p className="text-center text-sm text-muted-foreground pt-2">
                Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")} className="text-primary font-medium hover:underline">Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <img src="https://images.unsplash.com/photo-1555448248-2571daf6344b?w=1200&h=1600&fit=crop"
          alt="Water ripples" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/95" />
        <div className="relative z-10 max-w-lg p-12 text-white text-center">
          <Droplet className="w-16 h-16 mx-auto mb-8 opacity-80" />
          <h2 className="text-4xl font-bold mb-6 leading-tight">Every drop counts. Every home matters.</h2>
          <p className="text-white/80 text-lg">Join thousands working together to build a water-secure future for every Indian home.</p>
        </div>
      </div>
    </div>
  );
}
