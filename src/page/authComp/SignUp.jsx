import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../../features/auth/registerTC";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(true);
    if (password.length < 6) {
      alert("Пароль должен быть больше 6 символов");
       setState(false);
      return;
    }

    const resultAction = await dispatch(
      createUser({ email, password })
    ).unwrap();
    if (resultAction) {
      navigate("/profileset");
    }
     setState(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[var(--bg-color)]">
      <div className="max-w-md w-full p-8 shadow-md rounded">
        <h1 className="text-3xl font-bold text-center mb-4 text-[var(--text-color)]">
          WriteSide
        </h1>
        <p className="text-center text-gray-600 mb-6">Создайте аккаунт</p>
        <form onSubmit={handleSubmit} className="space-y-4 mb-5">
          <div className="mb-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border-b border-black outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border-b border-black outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </div>
          <button
            type="submit"
            className="w-full !text-white bg-green-500 p-2 rounded-md"
            disabled={state}
          >
            Зарегистрироваться
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="font-bold underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
