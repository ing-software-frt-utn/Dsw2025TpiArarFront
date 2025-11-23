import { useState } from "react";
import { login } from "../services/authService";
import logo from "../../../assets/images/plataformarar.png";
import { Link } from "react-router-dom";
import Popup from "../../../shared/Popup";
import { validPassword } from "../helper/passwordValidation";
import Form from "../../../shared/Form";
import FieldText from "../../../shared/FieldText";
import List from "../../../shared/List";
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
    <div>
      <img className="col-auto justify-content-center" src={logo} alt="Logo" />
      <h1 className="text-cyan-500 bg-sky-300 text-center">PLATAFORMA ARAR</h1>
      <h2 className="text-center">INICIAR SESIÓN</h2>
      <Form
        className="px-4 py-3 rounded-full bg-white-500 grid row-span-2 gap-4"
        onSubmit={handleSubmit}
      >
        <div className="grid row-span-2 gap-4">
          <label htmlFor="email" className="text-red-300 ">
            Email ss
          </label>

          <FieldText
            className="w-1/2"
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
          <label htmlFor="password" className="font-sans m-4 w-96">
            Contraseña
          </label>
          <FieldText
            className="text-lime-300"
            type="password"
            id="password"
            name="Password"
            value={user.Password}
            onChange={handlePasswordInput}
            label="Contraseña"
            isRequired
          />

          <List order="Unordered">
            {passwordErrors.map((err, index) => (
              <li
                key={index}
                className={`
                  text-lime-500
                  text-[0.8em]
                  m-4
                  p-2
                  text-left
                `}
              >
                {(err.isValid ? "\u2716" : "\u2714") + " - " + err.message}
              </li>
            ))}
          </List>
        </div>
        <div className="text-center space-y-2 sm:text-left">
          <Button type="submit" label="Enviar"></Button>
        </div>
      </Form>
      <p>
        ¿No tienes una cuenta? <Link to="/register">Registrate</Link>
      </p>
      {error && <Popup message={error} onClose={() => setError("")} />}

      {satisfactorio && (
        <Popup message={"Bienvenid@"} onClose={() => setSatisfactorio("")} />
      )}
    </div>
  );
}

export default LoginTemplate;
