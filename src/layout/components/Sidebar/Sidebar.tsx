import { useNavigate } from "react-router";
import Button from "../../../shared/components/Button";
interface Props {}
function Sidebar(props: Props) {
  const navigate = useNavigate();

  return (
    <div className="md:flex flex-col w-2/15 h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col gap-2 p-4 mt-2">
        <Button
          label="Home"
          imgSrc=""
          onClick={() => navigate("/")}
          className="w-full justify-start hover:bg-gray-50 text-gray-700"
        />
      </div>
    </div>
  );
}
export default Sidebar;
