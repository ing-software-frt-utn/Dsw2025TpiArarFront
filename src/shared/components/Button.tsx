import React from "react";

type Props = {
  label: string;
  imgSrc?: string | React.ReactNode;
  onClick?: () => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
};

function Button({
  label,
  imgSrc,
  onClick,
  type = "button",
  className = "",
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} button-base flex items-center gap-3 text-2xl`}
    >
      {imgSrc && typeof imgSrc === "string" ? (
        <img
          src={imgSrc}
          alt=""
          className="w-5 h-5 object-contain"
        />
      ) : (
        imgSrc
      )}
      <span>{label}</span>
    </button>
  );
}

export default Button;