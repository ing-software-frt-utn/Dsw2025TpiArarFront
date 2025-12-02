import { useState } from "react";
//import "../components/LoginTemplate.css";
import logo from "../../../assets/images/plataformarar.png";
import { Link } from "react-router-dom";
import { validPassword } from "../helpers/passwordValidation";
import { UserRegister } from "../types/auth";
import { useAuth } from "../hooks/useAuth";

import TextField from "../../../shared/components/TextField";
import Form from "../../../shared/components/Form";
import Button from "../../../shared/components/Button";
import ErrorPopup from "../../../shared/components/Popup";
import ListAuth from "./ListAuth";
import { useForm } from "react-hook-form";

function RegisterTemplate() {
  const { signUp } = useAuth();
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<UserRegister>();
  const { register, handleSubmit } = useForm<UserRegister>({
    defaultValues: {
      email: "",
      password: "",
      lastName: "",
      birthDate: "",
      name: "",
    },
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, email: value });
  };

  const [passwordErrors, setPasswordError] = useState<
    { message: string; isValid: boolean }[]
  >([]);
  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const newPassword = e.target.value;
    setUser({ ...user, password: newPassword });
    const message = validPassword(newPassword);
    const mappedMessages = message.map(([msg, isValid]) => ({
      message: msg,
      isValid,
    }));
    setPasswordError(mappedMessages);
  };
  const onSubmit = async (data: UserRegister) => {
    console.log(data);
    const response = await signUp(data);
    if (response.ok && response.id) {
      alert("Usuario registrado con éxito");
    } else {
      setError(response.message || "Error en el registro");
    }
  };
  return (
    <div className=" bg-gray-100 rounded-[2vw] p-3 md:p-3 ">
      <div className="flex flex-row justify-between items-center">
        <img src={logo} alt="Logo" className="logo" />
        <div className="flex-initial justify-center">
          <h1 className="text-blue-500 text-left m-1 text-2xl font-bold underline">
            Registro
          </h1>
        </div>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row gap-1 p-3">
          <TextField
            className="text-field-auth"
            id="name"
            label="Nombre"
            placeholder="Nombre"
            {...register("name", { required: true })}
          />
          <TextField
            className="text-field-auth"
            id="lastName"
            label="Apellido"
            placeholder="Apellido"
            {...register("lastName", { required: true })}
          />
        </div>
        <TextField
          className="text-field-auth grid-span-2"
          type="date"
          id="birthDate"
          label="Fecha de nacimiento"
          {...register("birthDate", {
            required: "La fecha de nacimiento es requerida",
          })}
        />
        <TextField
          className="text-field-auth"
          id="email"
          label="Email"
          {...register("email", { required: true })}
        />
        <div className="grid grid-row-2 ">
          <div className="grid grid-cols-2 m-3">
            <TextField
              className="text-field-auth"
              type="password"
              id="password"
              label="Contraseña"
              {...register("password", {
                required: "La Contraseña es requerida",
              })}
            />
            <TextField
              className="text-field-auth"
              type="password"
              id="confirmPassword"
              label="Confirmar Contraseña"
              {...register("password", { required: false })}
            />
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
      </Form>
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
