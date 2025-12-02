// router/Router.tsx
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Layout from "../common/Layout";
import UserRouter from "./UserRouter";
import MyPageRouter from "./MyPageRouter";
import PaymentRouter from "./PaymentRouter";
import SurveyRouter from "./SurveyRouter";

const LoadingPage = <div>Loading...</div>;
const MainPage = lazy(() => import("../pages/HomePage.tsx"));
const TestPage = lazy(() => import("../pages/TestPage.tsx"));
const PasswordCheckPage = lazy(
  () => import("../components/PasswordCheckComponent.tsx")
);

const Router = createBrowserRouter([
  {
    path: "",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={LoadingPage}>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: "test",
        element: (
          <Suspense fallback={LoadingPage}>
            <TestPage />
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
  },
  UserRouter(),
  MyPageRouter(),
  PaymentRouter(),
  SurveyRouter(),
]);

export default Router;
