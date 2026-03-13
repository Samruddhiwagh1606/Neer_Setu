import { useState, useMemo } from "react";
import { Link } from "wouter";
import { PlusCircle, Users, Leaf, Target, Calendar, CheckCircle2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getCampaigns, addCampaign, getRequests, type Campaign } from "@/lib/data";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-600",
  planned: "bg-blue-100 text-blue-700",
};

const IMPACT_TIPS = [
  { icon: "💧", title: "Raise Awareness", body: "Run awareness drives in your locality to educate households on benefits of rainwater harvesting." },
  { icon: "🌱", title: "Partner with Schools", body: "Schools are great entry points — install demo systems and create eco-champions among students." },
  { icon: "🏘️", title: "Rural Outreach", body: "Collaborate with gram panchayats to set up check dams and recharge pits in water-scarce villages." },
  { icon: "📋", title: "Subsidies Helpdesk", body: "Help residents navigate government schemes and paperwork to get maximum benefit from subsidies." },
];

export default function NgoDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => user ? getCampaigns(user.id) : []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", targetAudience: "",
    startDate: "", endDate: "", status: "planned" as Campaign["status"],
  });

  const totalRequests = useMemo(() => getRequests().length, []);
  const activeCampaigns = campaigns.filter(c => c.status === "active");
  const plannedCampaigns = campaigns.filter(c => c.status === "planned");
  const completedCampaigns = campaigns.filter(c => c.status === "completed");

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Title required", description: "Please enter a campaign name.", variant: "destructive" });
      return;
    }
    if (!user) return;
    const newCampaign = addCampaign(user.id, form);
    setCampaigns(prev => [...prev, newCampaign]);
    setForm({ title: "", description: "", targetAudience: "", startDate: "", endDate: "", status: "planned" });
    setShowForm(false);
    toast({ title: "Campaign Created!", description: `"${newCampaign.title}" has been added.` });
  };

  const deleteCampaign = (id: number) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast({ title: "Removed", description: "Campaign removed." });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">NGO Portal 🌿</h1>
              <p className="text-white/80">
                Welcome, {user.organizationName || user.name}! Drive awareness and water conservation campaigns.
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} variant="secondary" className="mt-4 md:mt-0 bg-white text-emerald-700 hover:bg-white/90 rounded-xl font-semibold">
              <PlusCircle className="w-4 h-4 mr-2" /> New Campaign
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Campaigns", value: campaigns.length, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Active", value: activeCampaigns.length, color: "text-teal-600", bg: "bg-teal-50" },
            { label: "Planned", value: plannedCampaigns.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Platform Requests", value: totalRequests, color: "text-primary", bg: "bg-primary/10" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-border shadow-sm text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* New Campaign Form */}
        {showForm && (
          <div className="bg-white rounded-3xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Campaign</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCampaign} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Campaign Name *</label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Monsoon Awareness Drive 2026" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Target Audience</label>
                  <Input value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                    placeholder="Urban households, Schools, Farmers…" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the campaign goals, activities, and expected impact…"
                  className="min-h-[100px]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Date</label>
                  <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">End Date</label>
                  <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Campaign["status"] }))}
                    className="w-full px-4 py-2 rounded-xl border border-border bg-slate-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="rounded-xl">Create Campaign</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* Active Campaigns */}
            {activeCampaigns.length > 0 && (
              <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-border bg-emerald-50/50">
                  <h2 className="text-lg font-bold flex items-center gap-2"><Target className="w-5 h-5 text-emerald-500" /> Active Campaigns</h2>
                </div>
                <div className="divide-y divide-border">
                  {activeCampaigns.map(c => (
                    <CampaignCard key={c.id} campaign={c} onDelete={deleteCampaign} />
                  ))}
                </div>
              </div>
            )}

            {/* Planned Campaigns */}
            {plannedCampaigns.length > 0 && (
              <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-border bg-blue-50/50">
                  <h2 className="text-lg font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-blue-500" /> Planned Campaigns</h2>
                </div>
                <div className="divide-y divide-border">
                  {plannedCampaigns.map(c => (
                    <CampaignCard key={c.id} campaign={c} onDelete={deleteCampaign} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedCampaigns.length > 0 && (
              <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-border bg-slate-50">
                  <h2 className="text-lg font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-slate-400" /> Completed</h2>
                </div>
                <div className="divide-y divide-border">
                  {completedCampaigns.map(c => (
                    <CampaignCard key={c.id} campaign={c} onDelete={deleteCampaign} />
                  ))}
                </div>
              </div>
            )}

            {campaigns.length === 0 && (
              <div className="bg-white rounded-3xl p-12 border border-dashed border-border text-center shadow-sm">
                <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Campaigns Yet</h3>
                <p className="text-muted-foreground mb-6">Create your first awareness or outreach campaign to get started.</p>
                <Button onClick={() => setShowForm(true)} className="rounded-xl">
                  <PlusCircle className="w-4 h-4 mr-2" /> Create First Campaign
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Tips */}
            <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-500" /> NGO Impact Ideas</h2>
              <div className="space-y-4">
                {IMPACT_TIPS.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{tip.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{tip.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Explore Platform</h2>
              <div className="space-y-2">
                {[
                  { label: "Browse Providers", link: "/providers" },
                  { label: "Government Schemes", link: "/schemes" },
                  { label: "Awareness Guides", link: "/awareness" },
                  { label: "Video Library", link: "/videos" },
                  { label: "System Types", link: "/systems" },
                ].map((l, i) => (
                  <Link key={i} href={l.link} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-foreground transition-colors">
                    {l.label} <span className="text-muted-foreground">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignCard({ campaign, onDelete }: { campaign: Campaign; onDelete: (id: number) => void }) {
  const STATUS_STYLES: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-slate-100 text-slate-600",
    planned: "bg-blue-100 text-blue-700",
  };
  return (
    <div className="p-6 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-semibold">{campaign.title}</h4>
            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_STYLES[campaign.status] || "bg-slate-100"}`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>
          {campaign.description && <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{campaign.description}</p>}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {campaign.targetAudience && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {campaign.targetAudience}</span>}
            {campaign.startDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {campaign.startDate}{campaign.endDate ? ` → ${campaign.endDate}` : ""}</span>}
          </div>
        </div>
        <button onClick={() => onDelete(campaign.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
