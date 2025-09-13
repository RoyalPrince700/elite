// DashboardSidebar.js
import React, { useState } from "react";
import { FaTasks, FaBook, FaStickyNote, FaBell, FaClock } from "react-icons/fa";
import { BsGear } from "react-icons/bs";
import { FiUser, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <aside
      className={`${
        isSidebarExpanded ? "w-64" : "w-20"
      } bg-blue-600 text-white flex flex-col justify-between transition-all duration-300`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center">
          {isSidebarExpanded ? (
            <h2 className="text-2xl font-bold">TaskMate</h2>
          ) : (
            <h2 className="text-2xl font-bold">TM</h2>
          )}
          <button onClick={toggleSidebar} className="text-white text-2xl">
            {isSidebarExpanded ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        <ul className="mt-8 space-y-6">
          <li className="flex items-center gap-3 hover:text-blue-300 cursor-pointer">
            <FaTasks className="text-xl" />
            {isSidebarExpanded && <Link to="/">Dashboard</Link>}
          </li>
          <li className="flex items-center gap-3 hover:text-blue-300 cursor-pointer">
            <FaBook className="text-xl" />
            {isSidebarExpanded && <Link to="/timetable">Timetable</Link>}
          </li>
          <li className="flex items-center gap-3 hover:text-blue-300 cursor-pointer">
            <FaStickyNote className="text-xl" />
            {isSidebarExpanded && <Link to="/notepad">Notepad</Link>}
          </li>
          <li className="flex items-center gap-3 hover:text-blue-300 cursor-pointer">
            <FaBell className="text-xl" />
            {isSidebarExpanded && <Link to="/reminders">Reminders</Link>}
          </li>
          <li className="flex items-center gap-3 hover:text-blue-300 cursor-pointer">
            <FaClock className="text-xl" />
            {isSidebarExpanded && <Link to="/study-mode">Study Mode</Link>}
          </li>
        </ul>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center">
            <FiUser className="text-white text-xl" />
          </div>
          {isSidebarExpanded && (
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-blue-300">Student</p>
            </div>
          )}
        </div>
        {isSidebarExpanded && (
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3 hover:text-blue-300 cursor-pointer">
              <BsGear className="text-xl" />
              <span>Settings</span>
            </li>
            <li className="flex items-center gap-3 hover:text-blue-300 cursor-pointer">
              <span>Logout</span>
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
