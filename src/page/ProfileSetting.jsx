import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../features/auth/updateProfileTC";
import { useNavigate } from "react-router-dom";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import { toggleTheme } from "../features/stories/themeSlice";

const ProfileSetting = () => {
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || avatarDef);
  const [error, setError] = useState("");
 const darkMode = useSelector((state) => state.theme.darkMode);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Пожалуйста, введите имя");
      return;
    }

    const resultAction = await dispatch(updateUserProfile({ name, avatar }));
    if (updateUserProfile.fulfilled.match(resultAction)) {
      navigate("/profile");
    } else if (resultAction.error) {
      setError(
        "Не удалось обновить профиль. Проверьте загрузку аватара или попробуйте снова."
      );
    }
  };

  if (!user) {
    return <div className="text-center mt-20 text-error">Загрузка...</div>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 pt-24 bg-background text-text transition-colors duration-300">
      <h1 className="text-3xl font-bold text-center mb-6">Настройки профиля</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Аватар */}
        <div className="flex justify-center mb-4">
          <img
            src={preview}
            alt="avatar preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-border"
          />
        </div>

        {/* Имя */}
        <input
          type="text"
          placeholder="Имя"
          className="w-full p-3 border border-border rounded bg-card text-text placeholder-gray-400 transition-colors duration-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Загрузка аватара */}
        <input
          type="file"
          accept="image/*"
          className="w-full p-3 border border-border rounded bg-card text-text transition-colors duration-300"
          onChange={handleAvatarChange}
        />

        {/* Сохранить */}
        <button
          type="submit"
          className="w-full p-3 bg-primary text-background rounded hover:bg-primary-hover transition-colors duration-300"
        >
          Сохранить
        </button>

        {error && <p className="text-error font-medium mt-2">{error}</p>}
      </form>

      {/* Переключатель темы */}
      <div className="mt-8">
        <label className="flex items-center justify-between bg-card p-3 rounded shadow transition-colors duration-300">
          <span className="text-lg">Тёмная тема</span>
          <button
            onClick={() => dispatch(toggleTheme())}
            className="px-4 py-2 bg-background border border-border text-text rounded hover:opacity-80 transition-colors duration-300"
          >
            {darkMode ? "Отключить 🌞" : "Включить 🌙"}
          </button>
        </label>
      </div>
    </div>
  );
};

export default ProfileSetting;
