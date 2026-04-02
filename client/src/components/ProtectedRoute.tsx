import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react";
import React, { useMemo } from "react";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

export const ProtectedRoute = ({ component }: ProtectedRouteProps) => {
  // Memoize the wrapped component so it doesn't get recreated on every render
  const Component = useMemo(() => withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vlu-red" />
      </div>
    ),
  }), [component]);

  return <Component />;
};
