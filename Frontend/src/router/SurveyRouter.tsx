// router/MyPageRouter.tsx
import { lazy, Suspense } from "react";
import Layout from "../common/Layout";

const LoadingPage = <div>Loading...</div>;
const SurveyBoardPage = lazy(() => import("../pages/survey/SurveyBoardPage"));
const SurveyCreatePage = lazy(() => import("../pages/survey/SurveyCreatePage"));
const SurveyDetailPage = lazy(() => import("../pages/survey/SurveyDetailPage"));
const SurveyMyPage = lazy(() => import("../pages/survey/SurveyMyPage"));
const SurveyParticipatePage = lazy(
  () => import("../pages/survey/SurveyParticipatePage")
);
const SurveyStatisticsPage = lazy(
    () => import("../pages/survey/SurveyStatisticsPage.tsx")
);

function SurveyRouter() {
  return {
    path: "surveys",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={LoadingPage}>
            <SurveyBoardPage />
          </Suspense>
        ),
      },
      {
        path: "create",
        element: (
          <Suspense fallback={LoadingPage}>
            <SurveyCreatePage />
          </Suspense>
        ),
      },
      {
        path: "my",
        element: (
          <Suspense fallback={LoadingPage}>
            <SurveyMyPage />
          </Suspense>
        ),
      },
      {
        path: ":id",
        element: (
          <Suspense fallback={LoadingPage}>
            <SurveyDetailPage />
          </Suspense>
        ),
      },
      {
        path: "participate/:id",
        element: (
          <Suspense fallback={LoadingPage}>
            <SurveyParticipatePage />
          </Suspense>
        ),
      },
      {
        path: ":id/statistics",
        element: (
            <Suspense fallback={LoadingPage}>
              <SurveyStatisticsPage />
            </Suspense>
        ),
      }
    ],
  };
}

export default SurveyRouter;
