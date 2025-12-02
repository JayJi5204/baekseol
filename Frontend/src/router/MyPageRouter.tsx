// router/MyPageRouter.tsx
import { lazy, Suspense } from "react";
import Layout from "../common/Layout";

const LoadingPage = <div>Loading...</div>;
const MyPage = lazy(() => import("../pages/myPage/MyPage.tsx"));
const UpdatePage = lazy(() => import("../pages/myPage/UpdatePage.tsx"));
const AdminStatisticsPage = lazy(() => import("../pages/myPage/admin/AdminStatisticsPage.tsx")); // 추가

function MyPageRouter() {
  return {
    path: "mypage",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
            <Suspense fallback={LoadingPage}>
              <MyPage />
            </Suspense>
        ),
      },
      {
        path: "update/:id",
        element: (
            <Suspense fallback={LoadingPage}>
              <UpdatePage />
            </Suspense>
        ),
      },
      {
        path: "admin/statistics", // 관리자 통계 페이지 추가
        element: (
            <Suspense fallback={LoadingPage}>
              <AdminStatisticsPage />
            </Suspense>
        ),
      },
    ],
  };
}

export default MyPageRouter;