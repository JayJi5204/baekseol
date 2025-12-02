import { useEffect } from "react";
import useZustandUser from "../zstore/useZustandUser";
import { useNavigate } from "react-router";

const useLogin = () => {
  const { user, login, logout, status, loadUserInfo } = useZustandUser();
  const navigate = useNavigate();

  const loginState = user;
  const loginStatus = status;

  useEffect(() => {
    loadUserInfo();
  }, []);

  const doLogin = async (nickname: string, password: string) => {
    await login(nickname, password);
    navigate("/"); // 로그인 성공 후 홈으로 이동
  };

  const doLogout = () => {
    logout();
  };

  return { loginState, loginStatus, doLogin, doLogout };
};

export default useLogin;
