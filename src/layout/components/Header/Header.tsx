import UserProfile from "../UserProfile/UserProfile";
import nene from "../../../assets/images/Nene.png";
import hombre from "../../../assets/images/Hombre.png";

function Header() {
  const getUserDataFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return { name: "Usuario", role: "student" };

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      
      const roleValue = 
        decoded.role || 
        decoded.Role || 
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      const emailClaim = 
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
        decoded.email ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.unique_name ||
        decoded.name;

      let displayUsername = "Usuario";

      if (emailClaim) {
        displayUsername = emailClaim.includes("@") ? emailClaim.split("@")[0] : emailClaim;
      }

      const role = (
        roleValue === "Professor" || 
        roleValue === "profesor" || 
        roleValue === "professor" || 
        roleValue === "Teacher" || 
        roleValue === "teacher"
      ) ? "professor" : "student";
      
      return { name: displayUsername, role };
    } catch (error) {
      return { name: "Usuario", role: "student" };
    }
  };

  const { name, role } = getUserDataFromToken();
  const avatar = role === "professor" ? hombre : nene;

  return (
    <div className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-b-blue-300 shadow-sm">
      <img
        src="/plataformarar.png"
        alt="Logo ARAR"
        className="h-14 w-auto object-contain"
      />

      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-violet-100 text-violet-600 border border-violet-200">
          {role}
        </span>
        <UserProfile name={name} imgSrc={avatar} />
      </div>
    </div>
  );
}

export default Header;