import { LogOut } from "lucide-react";
import { logout } from "../../utils/auth";

const LogoutButton = () => {
  return (
    <button
      onClick={logout}
      className="
        flex items-center gap-2
        px-4 py-2 rounded-lg
        bg-red-600 text-white
        hover:bg-red-700 transition
        text-sm font-medium
      "
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
};

export default LogoutButton;
