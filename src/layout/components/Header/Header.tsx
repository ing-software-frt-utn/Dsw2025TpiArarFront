import UserProfile from "../UserProfile/UserProfile";
function Header() {
  return (
    <>
      <div className="flex items-center justify-between w-full h-16 px-6 bg-white border-b border-b-blue-300 shadow-sm">
        <img
          src="/plataformarar.png"
          alt="Logo ARAR"
          className="h-10 w-auto object-left-contain"
        />
        <UserProfile name="Mariano" imgSrc="/avatar.png" />
      </div>
    </>
  );
}
export default Header;
