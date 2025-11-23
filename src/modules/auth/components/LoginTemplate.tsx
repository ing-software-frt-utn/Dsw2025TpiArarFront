import { useState } from "react";
import { login } from "../services/authService";
import logo from "../../../assets/images/plataformarar.png";
import { Link } from "react-router-dom";
import Popup from "../../../shared/Popup";
import { validPassword } from "../helper/passwordValidation";
import Form from "../../../shared/Form";
import TextFieldAuth from "./TextFieldAuth";
import ListAuth from "./ListAuth";
//import List from "../../../shared/List";
import Button from "../../../shared/Button";
import "./LoginTemplate.css";
function LoginTemplate() {
  const [error, setError] = useState<string>("");
  const [satisfactorio, setSatisfactorio] = useState<string>("");
  const [user, setUser] = useState({
    Email: "",
    Password: "",
  });

  const [passwordErrors, setPasswordError] = useState<
    { message: string; isValid: boolean }[]
  >([]);

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, Email: e.target.value });
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setUser({ ...user, Password: newPassword });
    const message = validPassword(newPassword);
    const mappedMessages = message.map(([msg, isValid]) => ({
      message: msg,
      isValid: isValid,
    }));
    setPasswordError(mappedMessages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validPassword(user.Password)) {
      setError("Por favor, corrige el formato de la contraseña.");
      return;
    }
    const data = await login(user);

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setSatisfactorio("Bienvenido");
    } else {
      setError(data?.message || "Credenciales inválidas");
    }
  };

  return (
    <div className=" bg-gray-100 rounded-[2vw] p-4 md:p-3 ">
      <div className="flex justify-between items-center">
        <h1 className="text-center text-2xl font-bold underline flex-1 ">
          Bienvenido a
        </h1>
        <img className="scale-[50%] bg-gray-100" src={logo} alt="Logo" />
      </div>
      <Form
        className="px-4 py-3 rounded-full bg-white-500 grid row-span-2 gap-4"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-row-2 row-span-2 grid-cols-1 p-3">
          <div className="grid row-span-3 gap-4">
            <label htmlFor="email" className="text-black font-sans m-2 w-96">
              Email
            </label>

            <TextFieldAuth
              type="email"
              id="email"
              name="Email"
              value={user.Email}
              onChange={handleUsernameInput}
              label="Correo Electrónico"
              isRequired
            />
          </div>
          <div className="grid row-span-3 gap-4">
            <label htmlFor="password" className="font-sans m-2 w-96">
              Contraseña
            </label>
            <TextFieldAuth
              type="password"
              id="password"
              name="Password"
              value={user.Password}
              onChange={handlePasswordInput}
              label="Contraseña"
              isRequired
            />

            <ListAuth
              items={passwordErrors}
              msg={(passwordErrors) => passwordErrors.message}
              valid={(passwordErrors) => passwordErrors.isValid}
            />
          </div>
        </div>
      </Form>
      <div className="flex justify-center space-x-4 space-y-4 sm:text-left">
        <div>
          <Button
            className="py-2 px-4 button-primary"
            type="submit"
            label="Iniciar Sesión"
            onClick={() => console.log("ejemplo")}
          />
        </div>
        <div>
          <Link to="/register">
            <Button
              className="py-2 px-4 button-secundary"
              type="button"
              label="Registrarse"
            />
          </Link>
        </div>
      </div>
      {error && <Popup message={error} onClose={() => setError("")} />}

      {satisfactorio && (
        <Popup message={"Bienvenid@"} onClose={() => setSatisfactorio("")} />
      )}
    </div>
  );
}

export default LoginTemplate;
