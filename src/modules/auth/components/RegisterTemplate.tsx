import { useState, useEffect } from "react";
import logo from "../../../assets/images/plataformarar.png";
import { Link, useNavigate } from "react-router-dom";
import { validPassword } from "../helpers/passwordValidation";
import { UserRegister } from "../types/auth";
import { useAuth } from "../hooks/useAuth";

import TextField from "../../../shared/components/TextField";
import Form from "../../../shared/components/Form";
import ErrorPopup from "../../../shared/components/Popup";
import ListAuth from "./ListAuth";
import { useForm } from "react-hook-form";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = [
    { value: "01", label: "Enero" }, { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" }, { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
    { value: "07", label: "Julio" }, { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" }, { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" },
];
const days = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return day < 10 ? `0${day}` : `${day}`;
});

function RegisterTemplate() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [passwordErrors, setPasswordErrors] = useState<{ message: string; isValid: boolean }[]>([]);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<any>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            lastName: "",
            name: "",
            day: "",
            month: "",
            year: "",
        },
    });

    const passwordValue = watch("password");

    useEffect(() => {
        const message = validPassword(passwordValue || "");
        const mappedMessages = message.map(([msg, isValid]) => ({
            message: msg,
            isValid,
        }));
        setPasswordErrors(mappedMessages);
    }, [passwordValue]);

    const onInvalidForm = () => {
        setError("Por favor, completa todos los campos requeridos correctamente.");
    };

    const onSubmit = async (data: any) => {
        if (data.password !== data.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        const hasPasswordErrors = passwordErrors.some(err => err.isValid === true);
        if (hasPasswordErrors) {
            setError("La contraseña no cumple con los requisitos mínimos.");
            return;
        }

        if (!data.day || !data.month || !data.year) {
            setError("Por favor, completa tu fecha de nacimiento.");
            return;
        }

        const formattedBirthDate = `${data.year}-${data.month}-${data.day}`;

        const payload: UserRegister = {
            email: data.email,
            password: data.password,
            name: data.name,
            lastName: data.lastName,
            birthDate: formattedBirthDate
        };

        try {
            const response = await signUp(payload);
            
            if (response && response.studentId) {
                alert("¡Usuario registrado con éxito! Ahora puedes iniciar sesión.");
                navigate("/login"); 
            } else {
                alert("Usuario registrado con éxito.");
                navigate("/login");
            }
        } catch (err: any) {
            console.error("Error completo capturado:", err);
            
            const data = err?.response?.data;
            let errorMessage = "Error al intentar registrar el usuario.";

            if (data) {
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (typeof data === 'object') {
                    const title = data.title || data.Title || "";
                    const detail = data.detail || data.Detail || data.message || data.Message || "";
                    
                    if (title || detail) {
                        errorMessage = `${title} - ${detail}`.trim();
                    } else {
                        errorMessage = "Detalles del servidor: " + JSON.stringify(data);
                    }

                    if (data.errors) {
                        errorMessage += " | Errores de validación: " + JSON.stringify(data.errors);
                    }
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        }
    };

    const selectClasses = "w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 cursor-pointer text-gray-700";

    return (
        <div className="bg-gray-100 rounded-2xl p-6 md:p-8 shadow-lg w-full max-w-lg mx-auto mt-10">
            
            <div className="flex flex-col items-center mb-6">
                <img className="h-16 w-auto mb-2" src={logo} alt="Logo" />
                <h1 className="text-center text-2xl font-bold text-gray-800">
                    Registro
                </h1>
                <div className="h-1 w-12 bg-violet-500 rounded mt-1"></div>
            </div>

            <Form onSubmit={handleSubmit(onSubmit, onInvalidForm)} className="flex flex-col gap-4">
                
                <div className="flex flex-col md:flex-row gap-4">
                    <TextField
                        className="text-field-auth w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200"
                        id="name"
                        label="Nombre"
                        placeholder="Juan"
                        {...register("name", { required: true })}
                    />
                    <TextField
                        className="text-field-auth w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200"
                        id="lastName"
                        label="Apellido"
                        placeholder="Pérez"
                        {...register("lastName", { required: true })}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Fecha de nacimiento</label>
                    <div className="flex gap-2">
                        <select className={selectClasses} {...register("day", { required: true })}>
                            <option value="" disabled>Día</option>
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        
                        <select className={selectClasses} {...register("month", { required: true })}>
                            <option value="" disabled>Mes</option>
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>

                        <select className={selectClasses} {...register("year", { required: true })}>
                            <option value="" disabled>Año</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                <TextField
                    className="text-field-auth w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200"
                    type="email"
                    id="email"
                    label="Email"
                    placeholder="username@email.com"
                    {...register("email", { required: true })}
                />

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <TextField
                            className="text-field-auth w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200"
                            type="password"
                            id="password"
                            label="Contraseña"
                            placeholder="********"
                            {...register("password", { required: "La Contraseña es requerida" })}
                        />
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-2">
                        <TextField
                            className="text-field-auth w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200"
                            type="password"
                            id="confirmPassword"
                            label="Confirmar Contraseña"
                            placeholder="********"
                            {...register("confirmPassword", { required: true })}
                        />
                    </div>
                </div>

                {passwordValue && (
                    <div className="bg-white p-3 rounded border border-gray-200 shadow-sm mt-1 text-sm">
                        <ListAuth
                            items={passwordErrors}
                            msg={(error) => error.message}
                            valid={(error) => error.isValid}
                        />
                    </div>
                )}

                <div className="mt-4">
                    <button
                        className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded shadow-md transition duration-200 ease-in-out transform hover:scale-[1.02]"
                        type="submit"
                    >
                        Crear Cuenta
                    </button>
                </div>
            </Form>

            <div className="flex justify-center mt-6">
                <p className="text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        className="text-violet-600 font-semibold hover:underline"
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