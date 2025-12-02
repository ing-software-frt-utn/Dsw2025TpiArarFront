import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/plataformarar.png";
import { Link } from "react-router-dom";
import Popup from "../../../shared/components/Popup";
import { validPassword } from "../helpers/passwordValidation";
import Form from "../../../shared/components/Form";
import ListAuth from "./ListAuth";
import Button from "../../../shared/components/Button";
import "./LoginTemplate.css";
import { useForm } from "react-hook-form";
import { User } from "../types/auth";
import TextField from "../../../shared/components/TextField";

function LoginTemplate() {
  const { logIn } = useAuth();
  const [error, setError] = useState<string>("");
  const [satisfactorio, setSatisfactorio] = useState<string>("");
  const { register, handleSubmit } = useForm<User>({
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = async (user: User) => {
    const { token, error } = await logIn(user);
    console.log(token, error);
    if (token) {
      setSatisfactorio("Inicio de sesión exitoso");
    } else {
      setError("Credenciales inválidas");
    }
  };
  const [passwordErrors, setPasswordError] = useState<
    { message: string; isValid: boolean }[]
  >([]);

  return (
    <div className="bg-gray-100 rounded-[2vw] p-4 md:p-3 ">
      <div className="flex flex-col items-center">
        <img className="logo" src={logo} alt="Logo" />
        <h1 className="m-1 text-center text-2xl font-bold underline ">
          Bienvenido
        </h1>
      </div>
      <Form
        className="px-4 py-3 rounded-full bg-white-500 grid row-span-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col row-span-3 grid-cols-1 p-3 m-2">
          <TextField
            className="text-field-auth"
            type="email"
            id="email"
            label="email"
            placeholder="username@email.com"
            {...register("email", { required: true })}
          />
          <TextField
            className="text-field-auth"
            type="password"
            id="password"
            label="Contraseña"
            placeholder="********"
            {...register("password", {
              onChange(e: React.ChangeEvent<HTMLInputElement>) {
                const newPassword = e.target.value;
                const message = validPassword(newPassword);
                const mappedMessages = message.map(([msg, isValid]) => ({
                  message: msg,
                  isValid: isValid,
                }));
                setPasswordError(mappedMessages);
              },
              required: true,
            })}
          />
        </div>
        <div className="flex justify-center space-x-4 space-y-4 sm:text-left">
          <Button
            className="py-2 px-4 button-primary"
            type="submit"
            label="Iniciar Sesión"
          />
          <Link to="/register">
            <Button
              className="py-2 px-4 button-secundary"
              type="button"
              label="Registrarse"
            />
          </Link>
        </div>
      </Form>

      <div>
        {error && <Popup message={error} onClose={() => setError("")} />}

        {satisfactorio && (
          <Popup message={"Bienvenid@"} onClose={() => setSatisfactorio("")} />
        )}
      </div>
    </div>
  );
}

export default LoginTemplate;
