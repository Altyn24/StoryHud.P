import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-red-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">StoryHub</h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Главная
            </Link>
          </li>
          <li>
            <Link to="/posts" className="hover:underline">
              Посты
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">
              О нас
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:underline">
              Вход
            </Link>
          </li>
          <li>
            <Link to="/signup" className="hover:underline">
              Регистрация
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:underline">
              Профиль
            </Link>
          </li>
          <li>
            <Link to="/create-post" className="hover:underline">
              Создать пост
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
