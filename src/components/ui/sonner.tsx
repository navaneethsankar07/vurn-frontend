import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="size-4 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-gray-400" />,
      }}
      style={
        {
          "--normal-bg": "#141416",
          "--normal-text": "#ffffff",
          "--normal-border": "rgba(255, 255, 255, 0.1)",
          "--border-radius": "4px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#141416] group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl font-mono text-xs rounded-[3px]",
          title: "text-xs font-semibold text-white",
          description: "text-[11px] text-gray-400 mt-0.5",
          actionButton:
            "group-[.toast]:bg-amber-500/10 group-[.toast]:text-amber-400 group-[.toast]:border group-[.toast]:border-amber-500/30 font-mono text-xs hover:bg-amber-500/20",
          cancelButton:
            "group-[.toast]:bg-white/5 group-[.toast]:text-gray-400 font-mono text-xs hover:bg-white/10",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };