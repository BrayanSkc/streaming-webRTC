import { AllHTMLAttributes } from "react";

export interface InButton extends AllHTMLAttributes<any> {
  label: string;
  icon?: string | undefined;
  mode: "primary" | "secondary";
  outline?: boolean;
  className?: string;
  type: "button" | "submit" | "reset";

}
