import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../features/auth/logoutTC";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSidebarOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className="p-3 w-full max-w-screen-xl shadow-md mb-3 mx-auto">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <Link to="/" className="text-2xl font-bold">
              StoryHub
            </Link>

            <div className="flex items-center w-[260px]">
              <label htmlFor="search" className="flex">
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
              </label>
              <input
                type="text"
                id="search"
                className="p-2 outline-none"
                placeholder="Поиск"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <Link to="/create" className="text-gray-500 flex items-center">
              <label>
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
              </label>
              Написать историю
            </Link>
            {isAuth && user ? (
              <div>
                <img
                  src={user.photoURL || "https://i.pravatar.cc/100"}
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

      {/* Сайдбар */}
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
              src={user.photoURL || "https://i.pravatar.cc/100"}
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
            to="/profile"
            onClick={closeSidebar}
            className="hover:underline"
          >
            Профиль
          </Link>
          <Link to="/" onClick={closeSidebar} className="hover:underline">
            Главная
          </Link>
          <button
            onClick={handleLogout}
            className="text-left text-red-600 hover:underline"
          >
            Выйти
          </button>
        </nav>
      </div>
    </>
  );
}

export default Header;