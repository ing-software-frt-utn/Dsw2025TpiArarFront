export interface FormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  children: React.ReactElement | React.ReactElement[];
}

function Form(props: FormProps) {
  return <form onSubmit={props.onSubmit}>{props.children}</form>;
}
export default Form;
