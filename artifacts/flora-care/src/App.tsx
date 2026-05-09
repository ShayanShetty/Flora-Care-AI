import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/lib/auth";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import UploadPage from "@/pages/upload";
import Results from "@/pages/results";
import History from "@/pages/history";
import Diseases from "@/pages/diseases";
import NotFound from "@/pages/not-found";

import "@/lib/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { token } = useAuthStore();
  if (!token) return <Redirect to="/" />;
  return <Component />;
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { token } = useAuthStore();
  if (token) return <Redirect to="/dashboard" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PublicRoute component={AuthPage} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/upload" component={() => <ProtectedRoute component={UploadPage} />} />
      <Route path="/results/:id" component={() => <ProtectedRoute component={Results} />} />
      <Route path="/history" component={() => <ProtectedRoute component={History} />} />
      <Route path="/diseases" component={() => <ProtectedRoute component={Diseases} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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

export default App;
