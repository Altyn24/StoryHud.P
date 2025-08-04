import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../features/auth/updateProfileTC";
import { useNavigate } from "react-router-dom";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";

const ProfileSetting = () => {
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || avatarDef);
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
    if (!name.trim()) {
      alert("Пожалуйста, введите имя");
      return;
    }
    const resultAction = await dispatch(updateUserProfile({ name, avatar }));
    if (updateUserProfile.fulfilled.match(resultAction)) {
      navigate("/profile"); 
    }
  };

  if (!user) {
    return <div className="text-center mt-20 text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 pt-24">
      <h1 className="text-3xl font-bold text-center mb-6">Настройки профиля</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center mb-4">
          <img
            src={preview}
            alt="avatar preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        </div>
        <input
          type="text"
          placeholder="Имя"
          className="w-full p-3 border border-gray-300 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          className="w-full p-3 border border-gray-300 rounded"
          onChange={handleAvatarChange}
        />
        <button
          type="submit"
          className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default ProfileSetting;