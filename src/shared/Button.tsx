type Props = {
  label: string;
  imgSrc?: string;
  onClick?: () => void;
  type?: "submit" | "reset";
  className?: string;
};

function Button(props: Props) {
  return (
    <>
      {props.imgSrc ? (
        <button className="" onClick={props.onClick}>
          <img src={props.imgSrc} alt="Icono del botón" />
          {props.label}
        </button>
      ) : (
        <button
          className={
            props.className ||
            "rounded-full h-full w-full blur-sm border border-gray-300 blur hover:blur-none"
          }
          type={props.type}
          onClick={props.onClick}
        >
          {props.label}
        </button>
      )}
    </>
  );
}
export default Button;
