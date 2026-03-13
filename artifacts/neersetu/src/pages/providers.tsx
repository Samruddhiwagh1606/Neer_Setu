import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, MapPin, Star, PhoneCall, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROVIDERS, saveFavoriteProvider, removeFavoriteProvider, getSavedProviderIds } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Providers() {
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [query, setQuery] = useState({ city: "", state: "" });
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedIds, setSavedIds] = useState<number[]>(() => user ? getSavedProviderIds(user.id) : []);

  const filtered = useMemo(() => PROVIDERS.filter(p => {
    const c = query.city.toLowerCase();
    const s = query.state.toLowerCase();
    return (!c || p.city.toLowerCase().includes(c) || p.serviceArea.toLowerCase().includes(c))
      && (!s || p.state.toLowerCase().includes(s));
  }), [query]);

  const handleSearch = () => setQuery({ city: cityFilter, state: stateFilter });

  const toggleSave = (providerId: number) => {
    if (!user) {
      toast({ title: "Login required", description: "Please login to save providers.", variant: "destructive" });
      return;
    }
    if (savedIds.includes(providerId)) {
      removeFavoriteProvider(user.id, providerId);
      setSavedIds(ids => ids.filter(id => id !== providerId));
      toast({ title: "Removed", description: "Provider removed from favourites." });
    } else {
      saveFavoriteProvider(user.id, providerId);
      setSavedIds(ids => [...ids, providerId]);
      toast({ title: "Saved!", description: "Provider added to favourites." });
    }
  };

  return (
    <div className="py-12 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-border mb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Find Verified Providers</h1>
            <p className="text-muted-foreground mb-6">Connect with certified experts who can design and install the perfect rainwater harvesting system for your home.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input type="text" placeholder="City (e.g. Mumbai)"
                  value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input type="text" placeholder="State (e.g. Maharashtra)"
                  value={stateFilter} onChange={e => setStateFilter(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <Button onClick={handleSearch} className="rounded-xl px-8 py-3 h-auto">
                <Search className="w-5 h-5 mr-2" /> Search
              </Button>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} provider{filtered.length !== 1 ? "s" : ""} found</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold">No providers found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or <button onClick={() => { setCityFilter(""); setStateFilter(""); setQuery({ city: "", state: "" }); }} className="text-primary underline">clear filters</button>.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(provider => (
              <div key={provider.id} className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    {provider.name.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleSave(provider.id)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      <Heart className={`w-4 h-4 ${savedIds.includes(provider.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    </button>
                    <div className="flex items-center bg-amber-50 text-amber-600 px-2 py-1 rounded-md text-sm font-medium">
                      <Star className="w-4 h-4 fill-amber-500 mr-1" />
                      {provider.rating} <span className="text-xs ml-1 text-amber-500">({provider.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1">{provider.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  {provider.city}, {provider.state}
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{provider.portfolio}</p>

                <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl text-sm">
                  <div className="flex items-center text-slate-700">
                    <Award className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                    <span>{provider.experience} years experience</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                    <span className="truncate">{provider.serviceArea}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Link href={user ? `/request?provider=${provider.id}` : "/login"} className="flex-1">
                    <Button className="w-full rounded-xl">Request Quote</Button>
                  </Link>
                  <a href={`tel:${provider.phone}`}>
                    <Button variant="outline" size="icon" className="rounded-xl flex-shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
