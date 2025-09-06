import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/loginTC";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState(false);
  const [error, setError] = useState(""); // 👈 стейт для ошибки

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(true);
    setError(""); // очищаем ошибки при новой попытке

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setState(false);
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password })).unwrap();
      if (resultAction) {
        const user = resultAction;
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
    } catch (err) {
      // 👇 ловим ошибки Firebase
      if (err.includes("wrong-password")) {
        setError("Неверный пароль");
      } else if (err.includes("user-not-found")) {
        setError("Пользователь не найден");
      } else {
        setError("Ошибка входа. Попробуйте снова");
      }
    } finally {
      setState(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[var(--bg-color)]">
      <div className="max-w-md w-full p-8 shadow-md rounded">
        <h1 className="text-3xl font-bold text-center mb-4 text-[var(--text-color)]">
          WriteSide
        </h1>
        <p className="text-center text-gray-600 mb-6">Войдите в аккаунт</p>
        <form onSubmit={handleSubmit} className="space-y-4 mb-5">
          <div className="mb-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border-b outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              className="w-full p-3 border-b outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 👇 Ошибки через motion */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 text-center bg-[var(--error)] text-white p-2 rounded"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full !text-white bg-green-500 p-2 rounded-md"
            disabled={state}
          >
            Войти
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          Нет аккаунта?{" "}
          <Link to="/signup" className="font-bold underline">
            Зарегистрироваться
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          Забыли пароль?{" "}
          <Link to="/reset-password" className="font-bold underline">
            Восстановить
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
