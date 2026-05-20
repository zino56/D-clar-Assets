import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/not-found";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import InboxPage from "@/pages/app/InboxPage";
import DocumentDetailPage from "@/pages/app/DocumentDetailPage";
import ReadinessPage from "@/pages/app/ReadinessPage";
import FollowupsPage from "@/pages/app/FollowupsPage";
import ExportsPage from "@/pages/app/ExportsPage";
import JobsPage from "@/pages/app/JobsPage";
import AgentsPage from "@/pages/app/AgentsPage";
import { useRoute } from "wouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function LandingChrome() {
  const [isApp] = useRoute("/app/:rest*");
  if (isApp) return null;
  return (
    <>
      <ScrollProgress />
      <BackToTop />
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/app">
        <Redirect to="/app/inbox" />
      </Route>
      <Route path="/app/inbox" component={InboxPage} />
      <Route path="/app/documents/:id" component={DocumentDetailPage} />
      <Route path="/app/readiness" component={ReadinessPage} />
      <Route path="/app/followups" component={FollowupsPage} />
      <Route path="/app/exports" component={ExportsPage} />
      <Route path="/app/jobs" component={JobsPage} />
      <Route path="/app/agents" component={AgentsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <LandingChrome />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
