import { Routes, Route } from "react-router-dom";
import "antd/dist/reset.css";
import "./App.css";
import Header from "./components/Header";
import Home from "./page/Home";
import SignUp from "./page/authComp/SignUp";
import Login from "./page/authComp/Login";
import NotFound from "./page/NotFound";
import Profile from "./page/Profile";
import ResetPassword from "./page/authComp/ResetPasword";
import AuthProvider from "./page/authComp/AuthProvider";
import CreateStory from "./page/CreateStory";
import Search from "./page/Search";
import Post from "./page/Post";
import ProfileSetting from "./page/ProfileSetting";
import Following from "./page/Following";
import ChannelPage from "./page/ChannelPage";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode])
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/channel/:uid" element={<ChannelPage/>}/>
        <Route path="/profileset" element={<ProfileSetting />} />
        <Route path="/following" element={<Following />} />
        <Route path="/create" element={<CreateStory />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
