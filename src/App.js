import "./App.css";
import AppContextProvider from "./store/AppContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Signup from "./Pages/Signup";
import CustomThemeProvider from "./store/Theme";
import RtlProvider from "./store/RtlProvider";
import Questionnaire from "./Pages/Questionnaire";
import Package from "./Pages/Package";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/profile", element: <Profile /> },
      { path: "/sign-up", element: <Signup /> },
      { path: "/questionnaire", element: <Questionnaire /> },
      { path: "/package", element: <Package /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

function App() {
  return (
    <AppContextProvider>
      <RtlProvider>
        <CustomThemeProvider>
          <RouterProvider router={router} />
        </CustomThemeProvider>
      </RtlProvider>
    </AppContextProvider>
  );
}

export default App;