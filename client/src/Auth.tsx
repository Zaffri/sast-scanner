import { Outlet } from "react-router";
import AppBar from "./components/AppBar";

const Auth = () => {
  return (
    <>
      <AppBar isLoggedIn={false} />

      <main className="max-w-7xl w-full mx-auto flex-1 p-6">
        <Outlet />
      </main>
    </>
  );
};

export default Auth;
