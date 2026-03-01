import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type Props = {
  label: string;
  imgSrc?: string | React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
};

function Button({
  label,
  imgSrc,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary",
}: Props) {
  // Mapeo de estilos según la variante
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100",
    secondary: "bg-slate-100 text-slate-500 hover:bg-slate-200 shadow-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-red-100",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50 shadow-none",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]} 
        ${className} 
        button-base flex items-center justify-center gap-3 text-2xl transition-all duration-200 
        ${disabled ? "opacity-50 cursor-not-allowed grayscale-[0.5]" : "active:scale-95 shadow-lg"}
      `}
    >
      {imgSrc && (
        <span className="flex items-center justify-center">
          {typeof imgSrc === "string" ? (
            <img
              src={imgSrc}
              alt=""
              className="w-6 h-6 object-contain"
            />
          ) : (
            imgSrc
          )}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}

export default Button;