import * as Icons from "lucide-react";
import { HelpCircle } from "lucide-react";

export type LucideIconName = keyof typeof Icons;

type IconProps = {
  name?: LucideIconName;
  className?: string;
};

export const Icon = ({ name = "HelpCircle", className = "" }: IconProps) => {
  const LucideIcon = (Icons as any)[name] || HelpCircle;
  return <LucideIcon className={`w-5 h-5 ${className}`} />;
};
