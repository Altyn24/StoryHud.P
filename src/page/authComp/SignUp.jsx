import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../../features/auth/registerTC";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Пароль должен быть больше 6 символов");
      return;
    }
    dispatch(createUser({ email, password }));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="max-w-md w-full p-8 shadow-md rounded">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          StoryHub
        </h1>
        <p className="text-center text-gray-600 mb-6">Создайть аккаунт</p>
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
          <button type="submit" className="w-full text-white p-3 rounded">
            Зарегистрироваться
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
