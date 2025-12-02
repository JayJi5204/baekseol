// router/PaymentRouter.tsx
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

const LoadingPage = <div>Loading...</div>;
const PaymentSuccessPage = lazy(() => import("../pages/payment/PaymentSuccessPage.tsx"));
const PaymentFailPage = lazy(() => import("../pages/payment/PaymentFailPage.tsx"));

const PaymentRouter = (): RouteObject => {
    return {
        path: "payment",
        children: [
            {
                path: "success",
                element: (
                    <Suspense fallback={LoadingPage}>
                        <PaymentSuccessPage />
                    </Suspense>
                ),
            },
            {
                path: "fail",
                element: (
                    <Suspense fallback={LoadingPage}>
                        <PaymentFailPage />
                    </Suspense>
                ),
            },
        ],
    };
};

export default PaymentRouter;
