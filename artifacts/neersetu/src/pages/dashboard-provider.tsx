import { useState, useMemo } from "react";
import { Link } from "wouter";
import { CheckCircle2, Clock, MapPin, Wrench, Star, User, Phone, Edit3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getRequests, saveRequests, type ServiceRequest } from "@/lib/data";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>(() => getRequests());
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    serviceArea: (user as any)?.serviceArea || "",
    phone: (user as any)?.phone || "",
    portfolio: "",
  });

  const allRequests = useMemo(() =>
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [requests]
  );

  const pending = allRequests.filter(r => r.status === "pending");
  const active = allRequests.filter(r => r.status === "accepted");
  const completed = allRequests.filter(r => r.status === "completed");

  const updateStatus = (id: number, status: "accepted" | "rejected" | "completed") => {
    const updated = requests.map(r => r.id === id ? { ...r, status } : r);
    saveRequests(updated);
    setRequests(updated);
    toast({ title: "Updated", description: `Request marked as ${status}.` });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-1">Provider Portal 🔧</h1>
            <p className="text-white/80">Hello, {user.name}! Manage your service requests and grow your reputation.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "New Leads", value: pending.length, color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
            { label: "Active Jobs", value: active.length, color: "text-blue-600", bg: "bg-blue-50", icon: Wrench },
            { label: "Completed", value: completed.length, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
            { label: "Total Jobs", value: allRequests.length, color: "text-primary", bg: "bg-primary/10", icon: Star },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-border shadow-sm flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
              <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Pending Requests */}
            <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-border bg-amber-50/50">
                <h2 className="text-lg font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> New Leads ({pending.length})</h2>
              </div>
              <div className="divide-y divide-border">
                {pending.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">No new requests at the moment.</p>
                ) : pending.map(req => (
                  <div key={req.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-semibold">{req.requestType} — {req.systemType}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_STYLES[req.status]}`}>Pending</span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {req.location}</div>
                          {req.preferredDate && <div>📅 Preferred: {req.preferredDate}</div>}
                          {req.notes && <div>📝 {req.notes}</div>}
                          <div className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {req.userName}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 md:flex-col">
                        <Button onClick={() => updateStatus(req.id, "accepted")} className="flex-1 md:flex-none rounded-xl bg-emerald-600 hover:bg-emerald-700">Accept</Button>
                        <Button onClick={() => updateStatus(req.id, "rejected")} variant="outline" className="flex-1 md:flex-none rounded-xl text-destructive border-destructive/30 hover:bg-red-50">Reject</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Jobs */}
            {active.length > 0 && (
              <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-blue-50/50">
                  <h2 className="text-lg font-bold flex items-center gap-2"><Wrench className="w-5 h-5 text-blue-500" /> Active Jobs ({active.length})</h2>
                </div>
                <div className="divide-y divide-border">
                  {active.map(req => (
                    <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold mb-1">{req.requestType} — {req.systemType}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {req.location}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><User className="w-3.5 h-3.5" /> {req.userName}</p>
                      </div>
                      <Button onClick={() => updateStatus(req.id, "completed")} variant="outline" className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        Mark Completed <CheckCircle2 className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-emerald-50/50">
                  <h2 className="text-lg font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Completed ({completed.length})</h2>
                </div>
                <div className="divide-y divide-border">
                  {completed.map(req => (
                    <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-medium">{req.requestType} — {req.systemType}</span>
                        <p className="text-sm text-muted-foreground">{req.location.substring(0, 50)}{req.location.length > 50 ? "…" : ""}</p>
                      </div>
                      {req.rating && (
                        <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                          <Star className="w-4 h-4 fill-amber-500" /> {req.rating}/5
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Sidebar */}
          <div>
            <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">My Profile</h2>
                <button onClick={() => setEditMode(e => !e)} className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                  {editMode ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
                </button>
              </div>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {user.name.charAt(0)}
              </div>
              <h3 className="text-center font-bold text-lg mb-1">{user.name}</h3>
              <p className="text-center text-sm text-muted-foreground mb-6">{user.email}</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Service Area</label>
                  {editMode ? (
                    <Input value={profile.serviceArea} onChange={e => setProfile(p => ({ ...p, serviceArea: e.target.value }))} placeholder="Cities / Regions" className="text-sm" />
                  ) : (
                    <p className="text-sm">{profile.serviceArea || "Not set"}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Phone</label>
                  {editMode ? (
                    <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="98765 43210" className="text-sm" />
                  ) : (
                    <p className="text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {profile.phone || "Not set"}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Portfolio / Bio</label>
                  {editMode ? (
                    <Textarea value={profile.portfolio} onChange={e => setProfile(p => ({ ...p, portfolio: e.target.value }))} placeholder="Describe your experience…" className="text-sm min-h-[80px]" />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.portfolio || "Add your experience and specialisations."}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
