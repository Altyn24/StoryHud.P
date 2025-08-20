import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StoryCards from "./StoryCards";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import { fetchUserPosts } from "../features/auth/channelSlice";
import { deleteStory, editStory } from "../features/stories/storiesSlice";
import { Modal, Input, Button, message } from "antd";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const { postsCache } = useSelector((state) => state.channel);

  const posts = user?.uid ? postsCache[user.uid] || [] : [];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedText, setEditedText] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null); // Состояние для меню каждой карточки

  const menuRefs = useRef({});

  useEffect(() => {
    if (user?.uid && !postsCache[user.uid]) {
      dispatch(fetchUserPosts(user.uid));
    }
  }, [user, dispatch, postsCache]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(menuRefs.current).forEach((storyId) => {
        if (menuRefs.current[storyId] && !menuRefs.current[storyId].contains(event.target)) {
          setMenuVisible((prev) => (prev === storyId ? null : prev));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-500">Загрузка профиля...</div>
    );
  }

  const handleDelete = (storyId) => {
    dispatch(deleteStory(storyId)).then(() => {
      setMenuVisible(null);
      message.success("Пост успешно удалён!");
    }).catch(() => {
      message.error("Ошибка при удалении поста");
    });
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setEditedTitle(story.title || "");
    setEditedText(story.text || "");
    setEditedImage(story.previewImage || null);
    setMenuVisible(null);
    setIsModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingStory) {
      dispatch(editStory({
        storyId: editingStory.id,
        title: editedTitle,
        text: editedText,
        previewImage: editedImage,
      })).then(() => {
        setIsModalVisible(false);
        message.success("Пост успешно обновлён!");
      }).catch(() => {
        message.error("Ошибка при обновлении поста");
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pt-24 h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{user.name || "Писатель"}</h1>
        <img
          src={user.photoURL || avatarDef}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover mb-4"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Мои публикации</h2>

      {posts.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-md text-center text-gray-600">
          <p>У вас пока нет публикаций.</p>
          <button
            onClick={() => navigate("/create")}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Написать историю
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((story) => (
            <div key={story.id} className="relative">
              <StoryCards story={story} />
              {user.uid === story.authorId && (
                <>
                  <button
                    onClick={() => setMenuVisible(menuVisible === story.id ? null : story.id)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                      />
                    </svg>
                  </button>
                  {menuVisible === story.id && (
                    <div
                      ref={(el) => (menuRefs.current[story.id] = el)}
                      className="absolute top-10 right-4 bg-white shadow-lg rounded-md p-2 z-10"
                    >
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(story.id)}
                        className="w-full text-left"
                      >
                        Удалить
                      </Button>
                      <Button
                        type="link"
                        onClick={() => handleEdit(story)}
                        className="w-full text-left"
                      >
                        Редактировать
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Редактировать пост"
        open={isModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setIsModalVisible(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Input
          placeholder="Заголовок"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="mb-4"
        />
        <Input.TextArea
          placeholder="Текст"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="mb-4"
        />
        <Input
          type="file"
          onChange={(e) => setEditedImage(e.target.files[0])}
          className="mb-4"
        />
      </Modal>
    </div>
  );
}