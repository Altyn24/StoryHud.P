import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
