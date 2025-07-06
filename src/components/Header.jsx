import { Link } from "react-router-dom";
import { logoutUser } from "../features/auth/logoutTC";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="p-3 w-full max-w-screen-xl border-b-4 border-[#CC2E2E] mb-3">
      <header className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">StoryHub</Link>

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

        <ul className="flex items-center gap-4 text-sm">
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/posts">Посты</Link>
          </li>
          {isAuth ? (
            <>
              <li>
                <Link to="/profile">Профиль</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:underline text-red-600"
                >
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <>
              
              <li>
                <Link to="/signup">Регистрация</Link>
              </li>
            </>
          )}
        </ul>
      </header>
    </div>
  );
}

export default Header;
