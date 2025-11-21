import "../styles/login.css";
import { login, register } from "../modules/auth/services/authService";
import { validPassword } from "../utils/passwordValidation";
import FieldText from "../shared/FieldText";
//import List from "../components/common/List";
import PopUp from "./Popup";
import logo from "../assets/images/plataformarar.png";
import user_icon from "../assets/images/person.png";
import email_icon from "../assets/images/email.png";
import password_icon from "../assets/images/password.png";
import { useState } from "react";

type AuthAction = "Iniciar Sesión" | "Registrarse";

const LoginSignUpView = () => {
  const [action, setAction] = useState<AuthAction>("Iniciar Sesión");
  const [error, setError] = useState<string>("");
  const [satisfactorio, setSatisfactorio] = useState<string>("");

  const [user, setUser] = useState({
    Email: "",
    Password: "",
    Username: "",
    Nombre: "",
    Apellido: "",
    FechaNacimiento: "",
  });

  const [passwordErrors, setPasswordError] = useState<
    { message: string; isValid: boolean }[]
  >([]);

  //handlers de inputs

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    setUser({ ...user, [key]: value });
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setUser({ ...user, Password: newPassword });

    const messages = validPassword(newPassword);
    const mappedMessages = messages.map(([msg, isValid]) => ({
      message: msg,
      isValid,
    }));
    setPasswordError(mappedMessages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    if (action === "Iniciar Sesión") {
      const credentials = { Email: user.Email, Password: user.Password };
      const data = await login(credentials);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        setSatisfactorio("Bienvenido");
      } else {
        setError(data?.message || "Credenciales inválidas");
      }
    } else {
      //Si la contraseña no es válida, se bloquea el submit.
      const isPasswordValid = validPassword(user.Password).every(
        ([_, isValid]) => isValid === false,
      );

      if (!isPasswordValid) {
        setError("La contraseña no es válida.");
        return;
      }

      const credentialsToSend = {
        Username: user.Username,
        Password: user.Password,
        Email: user.Email,
        Nombre: user.Nombre,
        Apellido: user.Apellido,
        FechaNacimiento: user.FechaNacimiento,
      };

      const data = await register(credentialsToSend);

      if (data.ok && data.id) {
        setSatisfactorio(
          "Usuario registrado con éxito. Ahora puedes iniciar sesión.",
        );
        //Mueve a la vista de login después de un registro exitoso
        setAction("Iniciar Sesión");
        // Limpiar campos de registro
        setUser({
          Email: "",
          Password: "",
          Username: "",
          Nombre: "",
          Apellido: "",
          FechaNacimiento: "",
        });
      } else {
        setError(data.message || "Error en el registro");
      }
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="header">
        <div className="text">
          Bienvenido a <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Iniciar Sesión" ? (
          <div></div>
        ) : (
          <div>
            <div className="input">
              <img src={user_icon} alt="" />
              <FieldText
                name="Nombre"
                value={user.Nombre}
                onChange={handleChange}
                placeholder="Nombre"
                isRequired /* solo pide nombre en el registro, despues agregar si se quiere pedir apellido, fecha nacimiento, usuario, etc */
              />
            </div>
          </div>
        )}

        <div className="input">
          <img src={email_icon} alt="" />
          <FieldText
            type="email"
            name="Email"
            value={user.Email}
            onChange={(e) => setUser({ ...user, Email: e.target.value })}
            placeholder="Email"
            isRequired
          />
        </div>

        <div className="input">
          <img src={password_icon} alt="" />
          <FieldText
            type="password"
            name="Password"
            value={user.Password}
            onChange={handlePasswordInput}
            placeholder="Contraseña"
            isRequired
          />
        </div>
      </div>

      {/* {user.Password && ( //muestra lista solo si hay algo escrito
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
              {(err.isValid ? "\u2714" : "\u2716") + " - " + err.message}
            </li>
          ))}
        </List>
      )} */}

      {action === "Registrarse" ? (
        <div></div>
      ) : (
        <div>
          <div className="forgot-password">
            ¿Olvidaste tu contraseña? <span> Haz click aquí!</span>
          </div>
        </div>
      )}
      <div className="submit-container">
        <div
          className={action === "Registrarse" ? "submit gray" : "submit"}
          onClick={() => {
            setAction("Iniciar Sesión");
          }}
        >
          Iniciar Sesión
        </div>
        <div
          className={action === "Iniciar Sesión" ? "submit gray" : "submit"}
          onClick={() => {
            setAction("Registrarse");
          }}
        >
          Registrarse
        </div>
      </div>
      {error && <PopUp message={error} onClose={() => setError("")} />}
      {satisfactorio && (
        <PopUp message={satisfactorio} onClose={() => setSatisfactorio("")} />
      )}
    </form>
  );
};

export default LoginSignUpView;
