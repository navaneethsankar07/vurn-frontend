import React from "react";
import * as LucideIcons from "lucide-react";
import { HelpCircle, type LucideProps } from "lucide-react";

function kebabToPascalCase(str: string): string {
  return str
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

export function renderOrgIcon(iconName: string, props?: LucideProps) {
  const componentName = kebabToPascalCase(iconName);

  const IconComponent =
    (LucideIcons[
      componentName as keyof typeof LucideIcons
    ] as React.FC<LucideProps>) || HelpCircle;

  return <IconComponent {...props} />;
}
