type Props = {
  label: string;
  imgSrc?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
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
          className={props.className?.toString() + " button-base"}
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
