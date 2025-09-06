import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/app-layout';
import UsersPage from '@/pages/users-page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/" component={() => <AppLayout><UsersPage /></AppLayout>} />
            <Route path="/users" component={() => <AppLayout><UsersPage /></AppLayout>} />
            <Route>
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Page Not Found</h1>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;