import React from "react";
import TextField from "../../../shared/TextField";
export interface FieldProps {
  type?: string;
  name: string;
  value: string;
  id?: string;
  isRequired?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}
function TextFieldAuth(props: FieldProps) {
  return (
    <TextField
      type={props.type}
      name={props.name}
      value={props.value}
      id={props.id}
      isRequired={props.isRequired}
      onChange={props.onChange}
      placeholder={props.placeholder}
      label={props.label}
      className="text-field-auth"
    />
  );
}
export default TextFieldAuth;
