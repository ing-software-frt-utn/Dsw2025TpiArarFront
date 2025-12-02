import { forwardRef } from "react";
export interface FieldProps {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  id?: string;
  error?: string;
  className?: string;
}
import React from "react";
const TextField = forwardRef(function (
  props: FieldProps & { [key: string]: any },
  ref,
) {
  const { id, label, className, error, placeholder, type, ...restProps } =
    props;
  return (
    <div className="text-field-div">
      {label && <label className="text-field-label">{label}</label>}
      <input
        id={id}
        className={`${className} text-field`}
        type={type || "text"}
        placeholder={placeholder || ""}
        ref={ref}
        {...restProps}
      />
    </div>
  );
});

export default TextField;
