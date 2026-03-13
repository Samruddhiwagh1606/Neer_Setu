import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Awareness from "@/pages/awareness";
import Videos from "@/pages/videos";
import Systems from "@/pages/systems";
import Schemes from "@/pages/schemes";
import Providers from "@/pages/providers";
import Login from "@/pages/login";
import ServiceRequest from "@/pages/request";
import UserDashboard from "@/pages/dashboard-user";
import ProviderDashboard from "@/pages/dashboard-provider";
import NgoDashboard from "@/pages/dashboard-ngo";
import NotFound from "@/pages/not-found";

const LegalPage = ({ title }: { title: string }) => (
  <div className="max-w-3xl mx-auto py-20 px-4">
    <h1 className="text-4xl font-bold mb-8">{title}</h1>
    <p className="text-muted-foreground">This page contains the {title}. Please contact us for the complete document.</p>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } }
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/awareness" component={Awareness} />
        <Route path="/videos" component={Videos} />
        <Route path="/systems" component={Systems} />
        <Route path="/schemes" component={Schemes} />
        <Route path="/providers" component={Providers} />
        <Route path="/login" component={Login} />
        <Route path="/request" component={ServiceRequest} />

        <Route path="/dashboard/user" component={UserDashboard} />
        <Route path="/dashboard/provider" component={ProviderDashboard} />
        <Route path="/dashboard/ngo" component={NgoDashboard} />

        <Route path="/terms"><LegalPage title="Terms & Conditions" /></Route>
        <Route path="/privacy"><LegalPage title="Privacy Policy" /></Route>
        <Route path="/provider-guidelines"><LegalPage title="Provider Guidelines" /></Route>
        <Route path="/ngo-partnership"><LegalPage title="NGO Partnership Terms" /></Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
