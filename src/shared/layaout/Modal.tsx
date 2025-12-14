import Button from "../components/Button";
import TextField from "../components/TextField";

type Props = {
    label: string;
    content?: string;
    isOpen: boolean;
    onClose: () => void;
};

function Modal({ label, content, isOpen, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <>

            <div className="fixed inset-0 flex items-center justify-center z-50">

                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col items-center">
                    <h1 className="text-xl font-semibold mb-4 text-center">{label}</h1>

                    <TextField
                        id="codigo"
                        label="Ingresar Código"
                        placeholder="Escribe tu código..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <Button
                        label="Cerrar"
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    />
                </div>
            </div>
        </>
    );
}

export default Modal;
