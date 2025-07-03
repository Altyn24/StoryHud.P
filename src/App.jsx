import { Routes, Route } from "react-router-dom";
import "antd/dist/reset.css";
import "./App.css";
import Header from "./components/Header";
import Home from "./page/Home";
import SignUp from './page/authComp/SignUp'
import Login from "./page/authComp/Login";
import NotFound from "./page/NotFound";
// import Profile from "./page/Profile";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='*' element={<NotFound/>}/>
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </>
  );
}

export default App;
