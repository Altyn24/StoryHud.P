import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../features/auth/logoutTC";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../page/NavBar";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import Search from "../page/Search";

function Header({ openSearch, setOpensearch }) {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    setSidebarOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/authprovider"
  )
    return null;

  return (
    <>
      <div className="p-3 w-full max-w-screen-xl shadow-md mb-3 mx-auto bg-[#acc3db] fixed top-0 left-0 right-0 z-50">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLeftSidebarOpen((prev) => !prev)}
              className="cursor-pointer pl-4"
            >
              {leftSidebarOpen ? (
                <div>
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
                </div>
              ) : (
                <div>
                  {" "}
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
                </div>
              )}
            </button>
            <NavBar
              isOpen={leftSidebarOpen}
              onClose={() => setLeftSidebarOpen(false)}
            />
            <Link to="/" className="text-2xl font-bold text-black">
              Write<span className="!text-blue-500">Side</span>
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Search search={openSearch} setOpensearch={setOpensearch}></Search>
            {/* <input
              type="text"
              className="rounded-xl bg-[#d5e5f4] px-4 py-2 outline-none"
              placeholder="Поиск"
            /> */}
            {/* <Link to="/create" className="text-gray-500 flex items-center gap-1">
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Написать историю
            </Link> */}
            {isAuth && user ? (
              <div>
                <img
                  src={user.photoURL || avatarDef}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-red-600 cursor-pointer"
                  onClick={() => setSidebarOpen(true)}
                />
              </div>
            ) : (
              <Link to="/signup" className="text-red-600 hover:underline">
                Регистрация
              </Link>
            )}
          </div>
        </header>
      </div>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />
      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-lg z-50 p-6 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Профиль</h2>
          <button
            onClick={closeSidebar}
            className="text-2xl font-bold text-gray-500 hover:text-black"
          >
            &times;
          </button>
        </div>
        {user && (
          <div className="flex flex-col items-center mb-6">
            <img
              src={user.photoURL || avatarDef}
              alt="avatar"
              className="w-20 h-20 rounded-full border-2 border-gray-300"
            />
            <p className="mt-2 text-lg font-semibold">
              {user.name || "Писатель"}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        )}
        <nav className="flex flex-col gap-4 border-b-1 p-2">
          <Link
            to="/profileset"
            className="rounded-xl p-2 hover:!bg-[#acc3db] hover:!text-white transition-all"
          >
            Настройки профиля
          </Link>
          <button
            onClick={handleLogout}
            className="text-left text-red-600 rounded-xl p-2 hover:!bg-[#acc3db] hover:!text-white transition-all"
          >
            Выйти
          </button>
        </nav>
      </div>
    </>
  );
}

export default Header;
