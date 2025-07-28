import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "../UI/Toast";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
      <Toast />
    </div>
  );
};

export default MainLayout;
