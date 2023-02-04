import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import { appLoader } from "./AppRoute"
import { profileLoader } from "./features/profile/ProfileRoute"
import Home from "./pages/Home"
import Profile from "./pages/Profile"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader,
    children: [
      { index: true, element: <Home /> },
      {
        path: "profile/:acellusID?",
        element: <Profile />,
        loader: profileLoader,
      },
    ],
  },
])
