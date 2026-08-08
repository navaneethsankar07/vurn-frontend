import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { queryClient } from "./queryClient";
import { AuthBootstrap } from "./AuthBootstrap";

type AppProvidersProps = {
  children: ReactNode;
};


export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap/>
      {children}
      </QueryClientProvider>
    </Provider>
  );
}