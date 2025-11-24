import { useState } from "react";
import { register } from "../services/authService";
//import "../components/LoginTemplate.css";
import logo from "../../../assets/images/plataformarar.png";
import { Link } from "react-router-dom";
import Button from "../../../shared/Button";
import ErrorPopup from "../../../shared/Popup";
import { validPassword } from "../helper/passwordValidation";
import TextFieldAuth from "./TextFieldAuth";
import ListAuth from "./ListAuth";
function RegisterTemplate() {
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState({
    Apellido: "",
    Nombre: "",
    Username: "",
    Password: "",
    PasswordClone: "",
    Email: "",
    FechaNacimiento: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name.charAt(0).toUpperCase() + name.slice(1)]: value });
  };

  const [passwordErrors, setPasswordError] = useState<
    { message: string; isValid: boolean }[]
  >([]);
  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const newPassword = e.target.value;
    setUser({ ...user, Password: newPassword });
    const message = validPassword(newPassword);
    const mappedMessages = message.map(([msg, isValid]) => ({
      message: msg,
      isValid,
    }));
    setPasswordError(mappedMessages);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await register(user);

    if (data.ok && data.id) {
      alert("Usuario registrado con éxito");
    } else {
      setError(data.message || "Error en el registro");
    }
  };

  return (
    <div className=" bg-gray-100 rounded-[2vw] p-3 md:p-3 ">
      <div className="flex justify-between items-center">
        <img src={logo} alt="Logo" className="logo" />
        <h1>PLATAFORMA ARAR</h1>
        <h2>REGISTRARSE</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-1 p-3">
          <div className="grid grid-row-2 p-3">
            <label htmlFor="apellido">Apellido</label>
            <TextFieldAuth
              id="apellido"
              name="Apellido"
              value={user.Apellido}
              onChange={handleChange}
              label="Apellido"
              isRequired
            />
          </div>
          <div className="grid grid-row-2 p-3">
            <label className="" htmlFor="nombre">
              Nombre
            </label>
            <TextFieldAuth
              id="nombre"
              name="Nombre"
              value={user.Nombre}
              onChange={handleChange}
              label="Nombre"
              isRequired
            />
          </div>
          <div className="grid grid-row-2 p-3">
            <label className="justify-self-start" htmlFor="fechaNacimiento">
              Fecha de Nacimiento
            </label>
            <TextFieldAuth
              className="grid-span-2"
              type="date"
              id="fechaNacimiento"
              name="FechaNacimiento"
              value={user.FechaNacimiento}
              onChange={(e) => {
                e.preventDefault();
                const newFechaNacimiento = e.target.value;
                setUser({ ...user, FechaNacimiento: newFechaNacimiento });
              }}
              label="Fecha de Nacimiento"
              isRequired
            />
          </div>
        </div>
        <div>
          <div className="grid grid-row-2 m-3">
            <label htmlFor="email">Email</label>
            <TextFieldAuth
              id="email"
              name="Email"
              value={user.Email}
              onChange={handleChange}
              label="Email"
              isRequired
            />
          </div>
        </div>
        <div className="grid grid-row-2 ">
          <div className="grid grid-cols-2 m-3">
            <div className="grid grid-row-2">
              <label htmlFor="password">Contraseña</label>
              <TextFieldAuth
                type="password"
                id="password"
                name="Password"
                value={user.Password}
                onChange={handlePasswordInput}
                label="Contraseña"
                isRequired
              />
            </div>
            <div className="grid grid-row-2">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <TextFieldAuth
                type="password"
                id="confirmPassword"
                name="ConfirmPassword"
                value={user.PasswordClone}
                onChange={(e) => {
                  e.preventDefault();
                  const newPasswordClone = e.target.value;
                  setUser({ ...user, PasswordClone: newPasswordClone });
                }}
                label="Confirmar Contraseña"
                isRequired
              />
            </div>
          </div>
          <div className="flex flex-col m-2">
            <ListAuth
              items={passwordErrors}
              msg={(error) => error.message}
              valid={(error) => error.isValid}
            />
          </div>
        </div>
        <div className="flex p-2 justify-center">
          <Button
            className="py-2 px-4 button-primary"
            type="submit"
            label="Registrarse"
          />
        </div>
      </form>
      <div className="flex justify-center">
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link
            className="text-blue-500 hover:underline active:text-violet-700 focus:text-violet-700"
            to="/login"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
      {error && <ErrorPopup message={error} onClose={() => setError("")} />}
    </div>
  );
}
export default RegisterTemplate;
