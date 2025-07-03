import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="p-3 w-full max-w-screen-xl border-b-3 mb-3 border-[#CC2E2E]">
      <header className="flex justify-between ">
        <h1 className="text-2xl font-bold">StoryHub</h1>
 <div className="flex flex-col w-[260px]">
        <label>Поиск истории по названию</label>
        <input className="rounded-md p-1 border-2 border-gray-200" />
      </div>
      <Link to="/profile">Профиль</Link>
        <nav>
          <ul className="flex gap-5 font-bold">
            <Link to="/signup" className="hover:underline hover:text-[#CC2E2E]">
              Регистрация
            </Link>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;

{
  /* <nav className="container mx-auto flex justify-between">
        <h1 className="text-3xl font-bold">StoryHub</h1>
        <ul className="flex gap-4">
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
      </nav> */
}
