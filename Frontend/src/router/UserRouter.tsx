import { lazy, Suspense } from "react";
import Layout from "../common/Layout";
const LoadingPage = <div>Loading...</div>;
const LoginPage = lazy(() => import("../pages/user/LoginPage.tsx"));
const SignupPage = lazy(() => import("../pages/user/SignupPage.tsx"));
const FindIdPage = lazy(() => import("../pages/user/FindIdPage.tsx"));
const SendEmail = lazy(() => import("../pages/user/SendEmailPage.tsx"));
const FindPasswordPage = lazy(
  () => import("../pages/user/FindPasswordPage.tsx")
);
const PasswordCheckPage = lazy(
  () => import("../pages/user/PasswordCheckPage.tsx")
);
function UserRouter() {
  return {
    path: "users",
    Component: Layout,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={LoadingPage}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "signup",
        element: (
          <Suspense fallback={LoadingPage}>
            <SignupPage />
          </Suspense>
        ),
      },
      {
        path: "findid",
        element: (
          <Suspense fallback={LoadingPage}>
            <FindIdPage />
          </Suspense>
        ),
      },
      {
        path: "sendemail",
        element: (
          <Suspense fallback={LoadingPage}>
            <SendEmail />
          </Suspense>
        ),
      },
      {
        path: "reset",
        element: (
          <Suspense fallback={LoadingPage}>
            <FindPasswordPage />
          </Suspense>
        ),
      },
      {
        path: "check/password",
        element: (
          <Suspense fallback={LoadingPage}>
            <PasswordCheckPage />
          </Suspense>
        ),
      },
    ],
  };
}
export default UserRouter;
