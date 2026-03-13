import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getRequests, saveRequests, type ServiceRequest } from "@/lib/data";

export default function ServiceRequest() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    requestType: "Installation",
    systemType: "Rooftop Basic",
    location: (user as any)?.location || "",
    preferredDate: "",
    notes: "",
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location.trim()) {
      toast({ title: "Location required", description: "Please enter your address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const existing = getRequests();
      const newReq: ServiceRequest = {
        id: Date.now(),
        userId: user.id,
        providerId: null,
        requestType: form.requestType,
        systemType: form.systemType,
        location: form.location,
        preferredDate: form.preferredDate,
        status: "pending",
        notes: form.notes,
        rating: null,
        review: null,
        userName: user.name,
        providerName: null,
        createdAt: new Date().toISOString(),
      };
      saveRequests([...existing, newReq]);
      setLoading(false);
      setSuccess(true);
      toast({ title: "Request Submitted!", description: "Providers in your area will be notified." });
    }, 600);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-sm border border-border">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
          <p className="text-muted-foreground mb-8">Your service request has been logged. Available providers will review it and contact you shortly.</p>
          <Link href={`/dashboard/${user.role}`}>
            <Button className="w-full rounded-xl py-6">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href={`/dashboard/${user.role}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-border">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Submit a Service Request</h1>
            <p className="text-muted-foreground mt-2">Provide details about your requirement so the right experts can reach out to you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Type of Service *</label>
                <select value={form.requestType} onChange={e => setForm(f => ({ ...f, requestType: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Installation</option>
                  <option>Consultation</option>
                  <option>Maintenance</option>
                  <option>Repair</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">System Type *</label>
                <select value={form.systemType} onChange={e => setForm(f => ({ ...f, systemType: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option value="Rooftop Basic">Basic Rooftop (Drums / Barrels)</option>
                  <option value="Rooftop Advanced">Advanced Rooftop (Underground Tank)</option>
                  <option value="Recharge Pit">Groundwater Recharge Pit</option>
                  <option value="Farm Pond">Agriculture Farm Pond</option>
                  <option value="Matka Filtration">Matka / Low-cost Filtration</option>
                  <option value="Other">Other / Not Sure</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Full Address *</label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="House No, Street, Area, City, Pincode" className="bg-slate-50 py-6 rounded-xl" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Date (Optional)</label>
              <Input type="date" value={form.preferredDate} onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))}
                className="bg-slate-50 py-6 rounded-xl" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Additional Notes (Optional)</label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Describe your property size, roof type, or specific requirements…"
                className="bg-slate-50 rounded-xl min-h-[120px]" />
            </div>

            <div className="pt-4 border-t border-border">
              <Button type="submit" className="w-full md:w-auto rounded-xl py-6 px-10 text-base shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
