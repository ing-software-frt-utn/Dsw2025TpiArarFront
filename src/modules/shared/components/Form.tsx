interface FormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}

function Form(props: FormProps) {
  return (
    <form
      className={
        props.className || "bg-white-500 px-4 py-3 rounded-lg shadow-md"
      }
      onSubmit={props.onSubmit}
    >
      {props.children}
    </form>
  );
}
export default Form;
