import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import AdminReview from "./pages/AdminReview";
import Collection from "./pages/Collection";
import Combine from "./pages/Combine";
import Home from "./pages/Home";
import config from "./data/config.json";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "combine", element: <Combine /> },
      { path: "collection", element: <Collection /> },
      { path: "admin", element: config.adminReviewEnabled ? <AdminReview /> : <Navigate to="/" replace /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
