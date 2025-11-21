import "./Button.css";
type Props = {
  label: string;
  imgSrc?: string;
  onClick?: () => void;
  type?: "submit" | "reset";
};

function Button(props: Props) {
  return (
    <div>
      {props.imgSrc ? (
        <button onClick={props.onClick}>
          <img src={props.imgSrc} alt="Icono del botón" />
          {props.label}
        </button>
      ) : (
        <button type={props.type} onClick={props.onClick}>
          {props.label}
        </button>
      )}
    </div>
  );
}
export default Button;
