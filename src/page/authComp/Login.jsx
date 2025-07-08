import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/loginTC";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return alert("Пароль слишком короткий");
    }

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload;
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name: user.displayName || "Без имени",
          email: user.email,
        })
      );

      navigate("/profile");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="max-w-md w-full p-8 shadow-md rounded">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          StoryHub
        </h1>
        <p className="text-center text-gray-600 mb-6">Войдите в аккаунт</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded transition"
          >
            Войти
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Нет аккаунта?{" "}
          <Link to="/signup" className="text-red-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          Забыли пароль?{" "}
          <Link to="/reset-password" className="text-red-600 hover:underline">
            Восстановить
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
