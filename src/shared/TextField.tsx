export interface FieldProps {
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  value?: string;
  id?: string;
  isRequired?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
}
import React from "react";
function TextField(props: FieldProps, ...restProps) {
  return (
    <>
      <input
        className={`${props.className} text-field-base`}
        type={props.type || "text"}
        id={props.id}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        {...restProps}
      />
    </>
  );
}

export default TextField;
