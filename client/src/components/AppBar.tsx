import { Link, useNavigate } from "react-router";
import { sendApiRequest } from "../service";

type Props = {
  isLoggedIn: boolean;
};

const AppBar = (props: Props) => {
  const navigate = useNavigate();

  const logout = async () => {
    const response = await sendApiRequest('/user/token/logout/', 'POST');

    if (response.error) {
      // TODO: show feedback
    }

    navigate('/login');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-8">
        <span className="text-xl font-bold text-gray-900">SAST Scan</span>

        <nav>
          {props.isLoggedIn && (
            <Link to="/">
              Uploads
            </Link>
            )}
        </nav>
      </div>

      {props.isLoggedIn && (
        <button
          onClick={logout}
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default AppBar;
