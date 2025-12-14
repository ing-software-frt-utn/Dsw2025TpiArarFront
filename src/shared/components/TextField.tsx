import { forwardRef } from "react";
import React from "react";

export interface FieldProps {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  id?: string;
  error?: string;
  className?: string;
}

const TextField = forwardRef(function (
  props: FieldProps & { [key: string]: any },
  ref
) {
  const { id, label, className, error, placeholder, type, ...restProps } = props;

  return (
    <div className="flex flex-col items-center w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 text-lg font-medium text-gray-700 text-center"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${className} text-field w-full max-w-sm text-lg px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
        type={type || "text"}
        placeholder={placeholder || ""}
        ref={ref}
        {...restProps}
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
});

export default TextField;