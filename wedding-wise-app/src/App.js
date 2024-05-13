// ============= LAST UPDATED =================
// =============   13-5-2024  =================
// " version - 1 - map loading issue resolved"
// ============= LAST UPDATED =================

import "./App.css";
import AppContextProvider from "./store/AppContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Signup from "./Pages/Signup";
import Tasks from "./Pages/Tasks";
import CustomThemeProvider from "./store/Theme";
import RtlProvider from "./store/RtlProvider";
import Questionnaire from "./Pages/Questionnaire";
import Package from "./Pages/Package";
import { useEffect } from "react";
import Finance from "./Pages/Finance";
import EditDetails from "./Pages/EditDetails";
import { LoadScript } from "@react-google-maps/api";

const googleMapsApiKey = "AIzaSyCSXv1ZziH2SJEcGQIp8EJMytapWnPjytQ";

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
      { path: "/tasks", element: <Tasks /> },
      { path: "/finance", element: <Finance /> },
      { path: "/edit", element: <EditDetails /> },
      
    ],
  },
  { path: "/login", element: <Login /> },
]);

function App() {
  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]} preventGoogleLibraries>
    <AppContextProvider>
      <RtlProvider>
        <CustomThemeProvider>
          <RouterProvider router={router} />
        </CustomThemeProvider>
      </RtlProvider>
    </AppContextProvider>
  </LoadScript>
  );
}

export default App;
