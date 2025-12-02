type Props = {
  name: string;
  imgSrc?: string;
  onClick?: () => void;
};

function UserProfile({ name, imgSrc, onClick }: Props) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
      onClick={onClick}
    >
      <p className="hidden md:block text-gray-700 font-medium">Hola, {name}</p>

      {imgSrc && (
        <img
          src={imgSrc}
          alt={`Foto de ${name}`}
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
      )}
    </div>
  );
}

export default UserProfile;
