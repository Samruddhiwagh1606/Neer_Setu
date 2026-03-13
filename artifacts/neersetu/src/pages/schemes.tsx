import { useState, useMemo } from "react";
import { Building2, IndianRupee, ExternalLink, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCHEMES } from "@/lib/data";

export default function Schemes() {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    if (!filter.trim()) return SCHEMES;
    return SCHEMES.filter(s => s.state.toLowerCase().includes(filter.toLowerCase()) || s.name.toLowerCase().includes(filter.toLowerCase()));
  }, [filter]);

  return (
    <div className="py-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Government Subsidies & Schemes</h1>
          <p className="text-lg text-muted-foreground">The government wants to help you save water. Discover state-level schemes, subsidies, and tax rebates for installing rainwater harvesting systems.</p>
        </div>

        <div className="max-w-xl mx-auto mb-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search by state or scheme name…"
            value={filter} onChange={e => setFilter(e.target.value)}
            className="w-full bg-white border-2 border-border pl-12 pr-4 py-4 rounded-2xl text-base focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm transition-all" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border">
            <p className="text-muted-foreground">No schemes found for "<strong>{filter}</strong>".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map(scheme => (
              <div key={scheme.id} className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">{scheme.state}</span>
                  <h3 className="text-xl font-bold mt-4 mb-3">{scheme.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{scheme.description}</p>
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl">
                    <div className="flex items-start gap-2">
                      <IndianRupee className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Subsidy / Benefit</div>
                        <div className="font-bold text-emerald-700">{scheme.subsidy}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Eligibility</div>
                        <div className="font-medium text-slate-800 text-sm">{scheme.eligibility}</div>
                      </div>
                    </div>
                  </div>
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full rounded-xl">
                      Official Guidelines <ExternalLink className="w-4 h-4 ml-2" />
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
