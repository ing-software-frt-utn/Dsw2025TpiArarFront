import { forwardRef, InputHTMLAttributes } from "react";

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; 
}

const TextField = forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, className = "", error, type = "text", ...restProps }, ref) => {
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
          ref={ref}
          type={type}
          className={`${className} text-field w-full max-w-sm text-lg px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
          {...restProps}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;