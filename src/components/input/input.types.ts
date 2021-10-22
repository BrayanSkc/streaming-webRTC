import { AllHTMLAttributes } from "react";

export interface InInput extends AllHTMLAttributes<any> {
  status?: "error" | "default";
  onChangeValue?: (value: any) => void;
}
