import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../features/auth/logoutTC";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../page/NavBar";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import { setSearchQuery } from "../features/searchSlice";
import SearchResult from "../page/Search";


function Header({ onMenuToggle }) {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const searchQuery = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    setSidebarOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  if (
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/authprovider"
  )
    return null;

  return (
    <>
      <div className="p-3 w-full shadow-md mb-3 bg-[#acc3db] fixed top-0 left-0 right-0 z-50 sm:">
        <header className="flex justify-between items-center max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLeftSidebarOpen((prev) => !prev)}
              className="cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {leftSidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
            <NavBar
              isOpen={leftSidebarOpen}
              onClose={() => setLeftSidebarOpen(false)}
            />
            <Link to="/" className="text-xl sm:text-2xl font-bold text-black">
              Write<span className="!text-blue-500">Side</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="relative flex items-center">
              <button
                onClick={toggleSearch}
                className="sm:hidden p-2"
                aria-label="Toggle search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
              <div
                className={`w-40 sm:w-64 ${
                  searchOpen ? "block" : "hidden sm:block"
                }`}
              >
                <input
                  type="text"
                  className="rounded-xl bg-[#d5e5f4] px-3 py-1 sm:px-4 sm:py-2 outline-none w-full text-sm sm:text-base"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
                <SearchResult />
              </div>
            </div>
            {isAuth && user ? (
              <div>
                <img
                  src={user.photoURL || avatarDef}
                  alt="avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-red-600 cursor-pointer"
                  onClick={() => setSidebarOpen(true)}
                />
              </div>
            ) : (
              <Link
                to="/signup"
                className="!text-white bg-[#2B2B2A] rounded-3xl px-3 py-1 hover: text-sm sm:text-base"
              >
                Регистрация
              </Link>
            )}
          </div>
        </header>
      </div>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300   bg-opacity-50 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />
      <div
        className={`fixed top-0 right-0 h-screen w-64 sm:w-72 bg-white shadow-lg z-50 p-4 sm:p-6 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Профиль</h2>
          <button
            onClick={closeSidebar}
            className="text-2xl font-bold text-gray-500 hover:text-black"
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div>
        {user && (
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <img
              src={user.photoURL || avatarDef}
              alt="avatar"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-300"
            />
            <p className="mt-2 text-base sm:text-lg font-semibold">
              {user.name || "Писатель"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">{user.email}</p>
          </div>
        )}
        <nav className="flex flex-col gap-4 border-t border-gray-200 pt-4">
          <Link
            to="/profileset"
            className="rounded-xl p-2 hover:bg-[#acc3db] hover:text-white transition-all text-sm sm:text-base"
          >
            Настройки профиля
          </Link>
          <button
            onClick={handleLogout}
            className="text-left text-red-600 rounded-xl p-2 hover:bg-[#acc3db] hover:!text-white transition-all text-sm sm:text-base"
          >
            Выйти
          </button>
        </nav>
      </div>
    </>
  );
}

export default Header;