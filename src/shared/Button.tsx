import "./Button.css";
type Props = {
  label: string;
  imgSrc?: string;
  onClick?: () => void;
  type: "submit" | "reset";
};

function Button(props: Props) {
  return (
    <>
      {props.imgSrc ? (
        <div>
          <button onClick={props.onClick}>
            <img src={props.imgSrc} alt="Icono del botón" />
            {props.label}
          </button>
        </div>
      ) : (
        <button type={props.type} onClick={props.onClick}>
          {props.label}
        </button>
      )}
    </>
  );
}
export default Button;
