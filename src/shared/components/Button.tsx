type Props = {
  label: string;
  imgSrc?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
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
      className={`${className} button-base flex items-centergap-3`}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          className="w-5 h-5 object-contain" // tamaño(w-5 = 20px)
        />
      )}
      <span>{label}</span>
    </button>
  );
}
export default Button;
