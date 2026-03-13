import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Droplet, FileText, Search, Star, Wrench, BookOpen, Video, Building2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getRequests, getSavedProviderIds, removeFavoriteProvider, PROVIDERS } from "@/lib/data";

const TIPS = [
  { title: "Fix Leaky Faucets", body: "A faucet leaking one drop per second wastes 3,000+ litres a year. Fix it cheap and save big." },
  { title: "Reuse Cooking Water", body: "Let boiled vegetable water cool and use it to water plants — it's rich in nutrients." },
  { title: "Shorter Showers", body: "Every minute saved in the shower conserves 8–10 litres. A 5-min shower uses 50% less water." },
  { title: "Full Loads Only", body: "Run washing machines and dishwashers only when fully loaded to save 30+ litres per wash." },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [savedIds, setSavedIds] = useState<number[]>(() => user ? getSavedProviderIds(user.id) : []);

  const myRequests = useMemo(() => {
    if (!user) return [];
    return getRequests().filter(r => r.userId === user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user]);

  const savedProviders = useMemo(() => PROVIDERS.filter(p => savedIds.includes(p.id)), [savedIds]);

  const handleUnsave = (providerId: number) => {
    if (!user) return;
    removeFavoriteProvider(user.id, providerId);
    setSavedIds(ids => ids.filter(id => id !== providerId));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-10 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name} 👋</h1>
              <p className="text-white/80">Ready to make a water-positive difference today?</p>
            </div>
            <Link href="/request" className="mt-6 md:mt-0">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 rounded-xl font-semibold">+ New Request</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "My Requests", value: myRequests.length, color: "text-primary", bg: "bg-primary/10" },
            { label: "In Progress", value: myRequests.filter(r => r.status === "accepted").length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Completed", value: myRequests.filter(r => r.status === "completed").length, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Saved Providers", value: savedIds.length, color: "text-rose-600", bg: "bg-rose-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-border shadow-sm text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Find Provider", icon: Search, link: "/providers", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Govt Schemes", icon: Building2, link: "/schemes", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Video Learning", icon: Video, link: "/videos", color: "text-violet-600", bg: "bg-violet-50" },
                { label: "Awareness", icon: BookOpen, link: "/awareness", color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Affordable Systems", icon: Wrench, link: "/systems", color: "text-cyan-600", bg: "bg-cyan-50" },
                { label: "New Request", icon: FileText, link: "/request", color: "text-rose-600", bg: "bg-rose-50" },
              ].map((a, i) => (
                <Link key={i} href={a.link}>
                  <div className="bg-white p-4 rounded-2xl border border-border text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                    <div className={`w-12 h-12 mx-auto rounded-xl ${a.bg} flex items-center justify-center mb-3`}>
                      <a.icon className={`w-6 h-6 ${a.color}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{a.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* My Requests */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">My Service Requests</h2>
                <Link href="/request" className="text-primary text-sm font-medium hover:underline">+ New</Link>
              </div>
              {myRequests.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-border">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No requests yet.</p>
                  <Link href="/request"><Button variant="outline" className="rounded-xl">Submit First Request</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.map(req => (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border hover:bg-slate-50 transition-colors gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold">{req.requestType}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_STYLES[req.status] || "bg-slate-100 text-slate-600"}`}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{req.systemType} · {req.location.substring(0, 40)}{req.location.length > 40 ? "…" : ""}</p>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {req.preferredDate ? req.preferredDate : new Date(req.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Providers */}
            <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500" /> Saved Providers</h2>
              {savedProviders.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-3">Browse providers and save your favourites.</p>
                  <Link href="/providers"><Button variant="outline" size="sm" className="rounded-lg w-full">Browse Providers</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedProviders.map(p => (
                    <div key={p.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold flex-shrink-0">{p.name.charAt(0)}</div>
                        <div>
                          <div className="font-medium text-sm">{p.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {p.rating} · {p.city}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleUnsave(p.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>
                  ))}
                  <Link href="/providers" className="block text-center text-sm text-primary font-medium mt-2 hover:underline">Browse more</Link>
                </div>
              )}
            </div>

            {/* Water Tip */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 border border-primary/10 relative overflow-hidden">
              <Droplet className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/10" />
              <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">💧 Water Tip</div>
                <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.body}</p>
              </div>
            </div>

            {/* Awareness Link */}
            <div className="bg-white rounded-3xl p-6 border border-border shadow-sm text-center">
              <BookOpen className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Learn About RWH</h3>
              <p className="text-sm text-muted-foreground mb-4">Explore guides, videos, and tips on rainwater harvesting.</p>
              <Link href="/awareness"><Button variant="outline" size="sm" className="rounded-xl w-full">Explore Awareness</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
