import clsx from "clsx";
import { InButton } from "./button.types";
import "./styles.css";

const Button: React.FC<InButton> = ({
  label,
  icon,
  mode,
  type,
  outline,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "button",
        mode ? `button-${mode}` : "",
        className ? className : ""
      )}
      {...props}
      type={type}
    >
      {icon ? <i className={icon}> </i> : null}
      {label}
    </button>
  );
};

export default Button;
