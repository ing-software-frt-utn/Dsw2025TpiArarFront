import React from "react";
import Form from "../../../shared/Form";
import TextField from "./TextFieldAuth";
import List from "../../../shared/List";
import Button from "../../../shared/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { validPassword } from "../helper/passwordValidation";

export interface User {
  Email: string;
  Password: string;
}
export interface FormLoginProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

function FormLogin(props: FormLoginProps) {
  const [user, setUser] = useState<User>({ Email: "", Password: "" });
  const [passwordErrors, setPasswordError] = useState<
    { message: string; isValid: boolean }[]
  >([]);
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const email = event.target.value;
    setUser({ ...user, Email: email });
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newPassword: string = event.target.value;
    const errors = validPassword(newPassword);
    setUser({ ...user, Password: newPassword });
    const mappedMessages = errors.map(([msg, isValid]) => ({
      message: msg,
      isValid: isValid,
    }));
    setPasswordError(mappedMessages);
  };
  return (
    <Form
      className={`
        bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
        flex flex-col
        gap-4`}
      onSubmit={props.onSubmit}
    >
      <div>
        <TextField
          type="email"
          id="email"
          name="Email"
          value={user.Email}
          onChange={handleEmail}
          label="Correo Electrónico"
          isRequired
        />
      </div>
      <div>
        <TextField
          type="password"
          id="password"
          name="Password"
          value={user.Password}
          onChange={handlePassword}
          label="Contraseña"
          isRequired
        />

        <List order="Unordered">
          {passwordErrors.map((err, index) => (
            <li
              key={index}
              style={{
                color: err.isValid ? "red" : "green",
                fontSize: "0.8em",
                margin: "0",
              }}
            >
              {(err.isValid ? "\u2714" : "\u2716") + " - " + err.message}
            </li>
          ))}
        </List>
      </div>
      <div>
        <Button type="submit" label="Enviar"></Button>
        <p>
          ¿No tienes una cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </Form>
  );
}
export default FormLogin;
