import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../features/auth/logoutTC";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../page/NavBar";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import { setSearchQuery } from "../features/searchSlice";
import SearchResult from "../page/Search";
import { toggleTheme } from "../features/stories/themeSlice";
import { motion } from "framer-motion";

function Header({ onMenuToggle }) {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const searchQuery = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [closeSideBar, setCloseSideBar] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);
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
      <div
        className="p-3 w-full shadow-md mb-3 bg-[var(--bg-header)] fixed top-0 left-0 right-0 z-50"
        style={{ fontFamily: '"Roboto Mono", monospace' }}
      >
        <header className="flex justify-between items-center max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLeftSidebarOpen((prev) => !prev)}
              className="cursor-pointer hidden sm:block text-[var(--text-color)]"
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
            <Link
              to="/"
              className="text-xl hidden sm:block sm:text-2xl font-bold text-[var(--text-color)]"
            >
              Write<span className="text-blue-500">Side</span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="relative flex items-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className={`w-40 sm:w-64 ${
                  searchOpen ? "block" : "hidden sm:block"
                }`}
              >
                <motion.input
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  type="text"
                  className="rounded-xl backdrop-blur-2xl bg-[var(--bg-input)] dark:bg-[var(--bg-input)] px-3 py-1 sm:px-4 sm:py-2 outline-none w-full text-sm sm:text-base text-[var(--text-color)] placeholder-[var(--text-color)] placeholder-opacity-50"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  onBlur={() => setSearchOpen(false)}
                />
                <SearchResult />
              </motion.div>
              <button
                onClick={toggleSearch}
                className="sm:hidden p-2 text-[var(--text-color)]"
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
            </div>
            {isAuth && user ? (
              <div>
                <img
                  src={user.photoURL || avatarDef}
                  alt="avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--error)] cursor-pointer"
                  onClick={() => setSidebarOpen(true)}
                />
              </div>
            ) : (
              <Link
                to="/signup"
                className="!text-white mx-3 bg-black rounded-3xl px-2 py-1 text-sm sm:text-base"
              >
                Регистрация
              </Link>
            )}
          </div>
        </header>
      </div>
      {/* SIDEBAR (справа) */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />
      <div
        className={`fixed top-0 right-0 h-screen w-64 sm:w-72 bg-[var(--bg-color)] shadow-lg z-50 p-4 sm:p-6 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ fontFamily: '"Roboto Mono", monospace' }}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-color)]">
            Профиль
          </h2>
          <button
            onClick={closeSidebar}
            className="text-2xl font-bold text-[var(--text-color)] opacity-70 hover:opacity-100"
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
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-300 dark:border-gray-600"
            />
            <p className="mt-2 text-base sm:text-lg font-semibold text-[var(--text-color)]">
              {user.name || "Писатель"}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-color)] opacity-70">
              {user.email}
            </p>
          </div>
        )}
        <nav className="flex flex-col gap-4 border-t border-gray-300 dark:border-gray-600 pt-4">
          <Link
            to="/profileset"
            className="rounded-xl p-2 hover:bg-[var(--primary-hover)] hover:text-[var(--text-color)] transition-all text-sm sm:text-base text-[var(--text-color)]"
            onClick={() => setSidebarOpen(false)}
          >
            Настройки профиля
          </Link>

          <div className="flex items-center justify-between transition-colors duration-300">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--text-color)] hover:bg-[var(--primary-hover)] transition-colors rounded-xl p-2">
              <span className="">Сменить тему</span>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="px-2 py-2 outline-none rounded hover:opacity-80 transition-colors duration-300"
              >
                {darkMode ? (
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
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
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
                      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                    />
                  </svg>
                )}
              </button>
            </label>
          </div>
          <button
            onClick={handleLogout}
            className="text-left text-[var(--error)] rounded-xl p-2 hover:bg-[var(--primary-hover)] hover:text-[var(--text-color)] transition-all text-sm sm:text-base"
          >
            Выйти
          </button>
        </nav>
      </div>
    </>
  );
}

export default Header;
