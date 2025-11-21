import { useState } from "react";
import { login } from "../services/authService";
import logo from "../../../assets/images/plataformarar.png";
import "./LoginTemplate.css";
import { Link } from "react-router-dom";
import Popup from "../../../shared/Popup";
import { validPassword } from "../helper/passwordValidation";
import Form from "../../../shared/Form";
import FieldText from "../../../shared/FieldText";
import List from "../../../shared/List";
import Button from "../../../shared/Button";

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
    <>
      <Form onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="logo" />
        <h1>PLATAFORMA ARAR</h1>
        <h2>INICIAR SESIÓN</h2>
        <div>
          <FieldText
            type="email"
            id="email"
            name="Email"
            value={user.Email}
            onChange={handleUsernameInput}
            label="Correo Electrónico"
            isRequired
          />
        </div>
        <div>
          <FieldText
            type="password"
            id="password"
            name="Password"
            value={user.Password}
            onChange={handlePasswordInput}
            label="Contraseña"
            isRequired
          />

          <List>
            {passwordErrors.map((err, index) => (
              <li
                key={index}
                style={{
                  color: err.isValid ? "red" : "green",
                  fontSize: "0.8em",
                  margin: "0",
                }}
              >
                {(err.isValid ? "\u2716" : "\u2714") + " - " + err.message}
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

      {error && <Popup message={error} onClose={() => setError("")} />}

      {satisfactorio && (
        <Popup message={"Bienvenid@"} onClose={() => setSatisfactorio("")} />
      )}
    </>
  );
}

export default LoginTemplate;
