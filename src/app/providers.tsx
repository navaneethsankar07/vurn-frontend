import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { store } from "./store";
import { queryClient } from "./queryClient";

type AppProvidersProps = {
  children: ReactNode;
};


export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      {children}
      </QueryClientProvider>
    </Provider>
  );
}