import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react";
import React from "react";

interface ProtectedRouteProps {
  component: React.ComponentType<object>;
}

const ProtectedComponent = withAuthenticationRequired(
  ({ component: Component }: { component: React.ComponentType<object> }) => <Component />,
  {
    onRedirecting: () => (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vlu-red" />
      </div>
    ),
  }
);

export const ProtectedRoute = ({ component }: ProtectedRouteProps) => {
  return <ProtectedComponent component={component} />;
};
