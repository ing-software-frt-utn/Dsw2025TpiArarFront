import UserProfile from "../UserProfile/UserProfile";
import Button from "../../../shared/components/Button";
function Header() {
  return (
    <>
      <div className="flex items-center justify-between w-full px-6 py-6 bg-white border-b border-b-blue-300 shadow-sm">

        <img
          src="/plataformarar.png"
          alt="Logo ARAR"
          className="h-16 w-auto object-left-contain"
        />


        <UserProfile name="Diego" imgSrc="/fotoperfil.jpeg" />

      </div>
    </>
  );
}
export default Header;
