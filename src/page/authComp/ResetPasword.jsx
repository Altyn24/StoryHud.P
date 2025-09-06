import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { message } from "antd";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      message.success("Письмо для сброса отправлено!");
    } catch (error) {
      console.error(error.code);

      if (error.code === "auth/user-not-found") {
        message.error("Пользователь с таким email не найден");
      } else if (error.code === "auth/invalid-email") {
        message.error("Некорректный email");
      } else {
        message.error("Ошибка при отправке письма");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="max-w-md w-full p-8 shadow-md rounded">
        <h1 className="text-2xl font-bold text-center mb-4">
          Восстановление пароля
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Введите email, чтобы получить ссылку на сброс пароля
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded"
          >
            Отправить ссылку
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Вспомнили пароль?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
