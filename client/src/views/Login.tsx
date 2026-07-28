import { useState } from "react";
import { useNavigate } from 'react-router';
import { sendApiRequest } from "../service";

function Login() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      username: loginForm.username,
      password: loginForm.password,
    };
    const response = await sendApiRequest('/user/token/', 'POST', undefined, payload);

    if (response.error) {
      // TODO: show user feedback
      return;
    }

    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex min-h-screen items-start justify-center py-14 sm:px-8 lg:px-8">
      <form
        onSubmit={login}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
      >
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>

          <input
            onChange={handleInputChange}
            type="text"
            id="username" 
            name="username" 
            placeholder="Username..."
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>

          <input
            onChange={handleInputChange}
            type="password"
            id="password" 
            name="password" 
            placeholder="Password..."
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
