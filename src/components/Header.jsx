import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/logoutTC";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function Header() {
  const user = useSelector((state) => state.auth.user);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="p-3 w-full max-w-screen-xl border-b-4 border-[#CC2E2E] mb-3 mx-auto">
      <header className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          StoryHub
        </Link>

        <div className="flex flex-col w-[260px]">
          <label htmlFor="search" className="text-sm mb-1">
            Поиск истории по названию
          </label>
          <input
            type="text"
            id="search"
            className="rounded-md p-2 border border-gray-300"
            placeholder="Введите название..."
          />
        </div>

        {isAuth ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-2">
              <img
                src={
                  user?.photoURL ||
                  "https://ui-avatars.com/api/?name=" + (user?.name || "User")
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <ChevronDownIcon className="w-4 h-4" />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
              <div className="p-2 text-sm text-gray-700 border-b">
                {user?.name || "Пользователь"}
              </div>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 hover:bg-gray-100 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Профиль
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/posts"
                    className={`block px-4 py-2 hover:bg-gray-100 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Посты
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 ${
                      active ? "bg-red-50" : ""
                    }`}
                  >
                    Выйти
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        ) : (
          <Link
            to="/signup"
            className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Регистрация
          </Link>
        )}
      </header>
    </div>
  );
}

export default Header;
