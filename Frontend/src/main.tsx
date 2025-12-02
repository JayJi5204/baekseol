import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import Router from "./router/Router.tsx";
import { initializeAuth } from "./utils/AuthInit.ts";

// ✅ 인증 초기화 후 앱 렌더링
initializeAuth().then(() => {
  createRoot(document.getElementById("root")!).render(
    <RouterProvider router={Router}></RouterProvider>
  );
});
