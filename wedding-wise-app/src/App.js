import "./App.css";
import AppContextProvider from "./store/AppContext";
import { RouterProvider, createHashRouter } from "react-router-dom";
import CoupleLayout from "./components/rootLayouts/CoupleLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Signup from "./Pages/Signup";
import Tasks from "./Pages/Tasks";
import CustomThemeProvider from "./store/Theme";
import RtlProvider from "./store/RtlProvider";
import Questionnaire from "./Pages/Questionnaire";
import Package from "./Pages/Package";
import Finance from "./Pages/ExpenseTracking";
import EditDetails from "./Pages/EditDetails";
import { LoadScript } from "@react-google-maps/api";
import Invitees from "./Pages/Invitees";
import SupplierLogin from "./Pages/SupplierLogin";
import SupplierLayout from "./components/rootLayouts/SupplierLayout";
import SupplierLP from "./Pages/SupplierLP";
import SupplierSignUp from "./Pages/SupplierSignUp";
import Loading from "./components/Loading";
import { auth } from "./fireBase/firebase";
import { useUserStore } from "./fireBase/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import SupplierPrivateProfile from "./Pages/SupplierPrivateProfile";
import SupplierPublicProfile from "./Pages/SupplierPublicProfile";
import { useSupplierData } from "./fireBase/supplierData";

import PlannerLP from "./Pages/PlannerLP";
import ExpenseTracking from "./Pages/ExpenseTracking";
const googleMapsApiKey = "AIzaSyC3QkzXx3mLsG_-IzI67-WVFBAoAZTYWxk";
const libraries = ["places"];

const router = createHashRouter([
  { path: "/", element: <Home /> },
  {
    path: "/",
    element: <CoupleLayout />,
    children: [
      { path: "profile", element: <Profile /> },
      { path: "sign-up", element: <Signup /> },
      { path: "questionnaire", element: <Questionnaire /> },
      { path: "package", element: <Package /> },
      { path: "tasks", element: <Tasks /> },
      { path: "expense-tracking", element: <ExpenseTracking /> },
      { path: "invitees", element: <Invitees /> },
      { path: "edit", element: <EditDetails /> },
      { path: "planner", element: <PlannerLP /> },
    ],
  },
  {
    element: <SupplierLayout />,
    children: [
      { path: "/suppliers", element: <SupplierLP /> },
      { path: "/supplier-signup", element: <SupplierSignUp /> },
      {
        path: "/supplier-private-profile",
        element: <SupplierPrivateProfile />,
      },
      {
        path: "/supplier-public-profile",
        element: <SupplierPublicProfile />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/supplier-login", element: <SupplierLogin /> },
]);

function App() {
  const { fetchUserInfo, setLoading, currentUser } = useUserStore();

  const { supplierData } = useSupplierData();

  console.log(supplierData);

 useEffect(() => {
  const handleAuthStateChanged = async (user) => {
    if (user?.uid) {
      setLoading(true);
      await fetchUserInfo(user.uid);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const unSubAuth = onAuthStateChanged(auth, handleAuthStateChanged);

  return () => {
    if (unSubAuth) {
      unSubAuth();
    }
  };
}, [fetchUserInfo, setLoading]);


  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={libraries}
      loadingElement={<Loading />}
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
