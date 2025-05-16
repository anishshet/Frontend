import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export const AuthLayout: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
 
  const toggleSidebar = () => {
    setIsNavOpen(!isNavOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};