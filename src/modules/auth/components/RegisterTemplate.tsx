import { useState, useEffect } from "react";
import logo from "../../../assets/images/plataformarar.png";
import { Link, useNavigate } from "react-router-dom";
import { validPassword } from "../helpers/passwordValidation";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import TextField from "../../../shared/components/TextField";
import Form from "../../../shared/components/Form";
import ErrorPopup from "../../../shared/components/Popup";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import ListAuth from "./ListAuth";

const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const months = [
  { v: "01", l: "Enero" }, { v: "02", l: "Febrero" }, { v: "03", l: "Marzo" },
  { v: "04", l: "Abril" }, { v: "05", l: "Mayo" }, { v: "06", l: "Junio" },
  { v: "07", l: "Julio" }, { v: "08", l: "Agosto" }, { v: "09", l: "Septiembre" },
  { v: "10", l: "Octubre" }, { v: "11", l: "Noviembre" }, { v: "12", l: "Diciembre" },
];

export default function RegisterTemplate() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ message: string; isValid: boolean }[]>([]);

  const { register, handleSubmit, watch } = useForm<any>({
    defaultValues: { email: "", password: "", confirmPassword: "", lastName: "", name: "", day: "", month: "", year: "" },
  });

  const passwordValue = watch("password");
  const isPasswordValid = passwordErrors.length > 0 && !passwordErrors.some(err => err.isValid);

  useEffect(() => {
    const valids = validPassword(passwordValue || "").map(([msg, ok]) => ({ message: msg, isValid: ok }));
    setPasswordErrors(valids);
  }, [passwordValue]);

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) return setError("Las contraseñas no coinciden.");
    if (!isPasswordValid) return setError("La contraseña no cumple con los requisitos de seguridad.");
    if (!data.day || !data.month || !data.year) return setError("Fecha incompleta.");

    setIsLoading(true);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        lastName: data.lastName,
        birthDate: `${data.year}-${data.month}-${data.day}`
      });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.response?.data?.message || "Error al registrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const selClass = "w-full px-4 py-2.5 border-2 border-gray-50 rounded-xl bg-gray-50/50 hover:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-transparent overflow-y-auto">
      {isLoading && <LoadingOverlay message="Creando tu cuenta..." />}
      
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl w-full max-w-lg border border-gray-100 flex flex-col my-auto relative">
        
        <div className="flex flex-col items-center mb-6">
          <img className="h-14 w-auto mb-2 drop-shadow-sm" src={logo} alt="Logo" />
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Registro</h1>
          <div className="h-1 w-10 bg-violet-500 rounded-full mt-1"></div>
        </div>

        <Form onSubmit={handleSubmit(onSubmit, () => setError("Por favor, completa todos los campos correctamente."))} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3">
            <TextField label="Nombre" placeholder="Juan" {...register("name", { required: true })} />
            <TextField label="Apellido" placeholder="Pérez" {...register("lastName", { required: true })} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nacimiento</label>
            <div className="flex gap-2">
              <select className={selClass} {...register("day", { required: true })}><option value="" disabled>Día</option>{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
              <select className={selClass} {...register("month", { required: true })}><option value="" disabled>Mes</option>{months.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}</select>
              <select className={selClass} {...register("year", { required: true })}><option value="" disabled>Año</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
            </div>
          </div>

          <TextField type="email" label="Email" placeholder="tu@email.com" {...register("email", { required: true })} />

          <div className="flex flex-col md:flex-row gap-3">
            <TextField type="password" label="Contraseña" placeholder="********" {...register("password", { required: true })} />
            <TextField type="password" label="Confirmar" placeholder="********" {...register("confirmPassword", { required: true })} />
          </div>

          {passwordValue && !isPasswordValid && (
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 shadow-inner text-[10px] animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="font-black text-violet-400 uppercase mb-2 ml-1">Requisitos de seguridad:</p>
              <ListAuth items={passwordErrors} msg={(e) => e.message} valid={(e) => e.isValid} />
            </div>
          )}

          <button 
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-bold rounded-[1.25rem] shadow-xl shadow-violet-200 transition-all active:scale-[0.98] text-lg flex justify-center items-center" 
            type="submit"
          >
            {isLoading ? "Procesando..." : "Crear Cuenta"}
          </button>
        </Form>

        <div className="flex justify-center mt-6">
          <p className="text-gray-500 text-sm font-medium">¿Ya tienes cuenta? <Link className="text-violet-600 font-black hover:underline" to="/login">Inicia sesión</Link></p>
        </div>
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
      </div>
    </div>
  );
}