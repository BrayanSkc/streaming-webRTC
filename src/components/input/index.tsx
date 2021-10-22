import { useCallback } from "react";
import { InInput } from "./input.types";
import "./styles.css";

const Input: React.FC<InInput> = ({ onChangeValue, status, ...props }) => {
  const handleChangeValue = useCallback(
    ({ target: { value } }) => {
      const event = { target: { value: value } };
      if (props.style === "number") {
        if (value) {
          event.target.value = parseInt(value);
        } else {
          event.target.value = undefined;
        }
      }
      if (onChangeValue) {
        onChangeValue(event);
      }
    },
    [onChangeValue, props.style]
  );

  return (
    <input
      className={`input-element input-element-${status ?? "default"}`}
      onChange={onChangeValue ? handleChangeValue : props.onChange}
      {...props}
    />
  );
};

export default Input;
