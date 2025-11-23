export interface FieldProps {
  type?: string;
  name: string;
  value: string;
  id?: string;
  isRequired?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}
import React from "react";
function FieldText(props: FieldProps) {
  return (
    <input
      className={props.className}
      type={props.type || "text"}
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      required={props.isRequired}
      placeholder={props.placeholder}
    />
  );
}

export default FieldText;
