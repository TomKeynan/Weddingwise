// ============= LAST UPDATED =================
// =============   29-6-2024  =================
// ============= LAST UPDATED =================

import "./App.css";
import AppContextProvider from "./store/AppContext";
import {
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
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
import Finance from "./Pages/Finance";
import EditDetails from "./Pages/EditDetails";
import { LoadScript } from "@react-google-maps/api";
import Invitees from "./Pages/Invitees";
import { auth } from "./fireBase/firebase";
import { useUserStore } from "./fireBase/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
const googleMapsApiKey = "AIzaSyCSXv1ZziH2SJEcGQIp8EJMytapWnPjytQ";

const router = createHashRouter([
  { path: "/", element: <Home /> },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "profile", element: <Profile /> },
      { path: "sign-up", element: <Signup /> },
      { path: "questionnaire", element: <Questionnaire /> },
      { path: "package", element: <Package /> },
      { path: "tasks", element: <Tasks /> },
      { path: "finance", element: <Finance /> },
      { path: "invitees", element: <Invitees /> },
      { path: "edit", element: <EditDetails /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);



function App() {

  const { fetchUserInfo } = useUserStore();
// When a user logs in, fetch their data.
useEffect(() => {
  // Subscribe to auth state changes
  const unSub = onAuthStateChanged(auth, (user) => {
    fetchUserInfo(user?.uid);
  });
  // Cleanup function to unsubscribe from auth state changes
  return () => {
    unSub();
  };
}, [fetchUserInfo]);

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={["places"]}
      preventGoogleLibraries
    >
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
