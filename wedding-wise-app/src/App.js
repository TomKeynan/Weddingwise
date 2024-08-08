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
import EditDetails from "./Pages/EditDetailsOnReplace";
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
import EditCoupleDetails from "./Pages/EditCoupleDetails";
import EditDetailsOnReplace from "./Pages/EditDetailsOnReplace";
import { getAuth, signOut } from "firebase/auth";
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
      { path: "edit-replace", element: <EditDetailsOnReplace /> },
      { path: "planner", element: <PlannerLP /> },
      { path: "edit-couple-details", element: <EditCoupleDetails /> },
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
  const { fetchUserInfo, setLoading, logout,currentUser } = useUserStore();

  useEffect(() => {
    const handleAuthStateChanged = async (user) => {
      if (user?.uid) {
        await fetchUserInfo(user.uid);
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
  }, [fetchUserInfo]);

 // useEffect for handling logout on window close
 useEffect(() => {
  let timeout;

  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'hidden') {
      timeout = setTimeout(async () => {
        await signOut(auth);
      }, 5000); // Adjust the timeout as needed
    } else if (document.visibilityState === 'visible') {
      clearTimeout(timeout);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    clearTimeout(timeout);
  };
}, []);

  
console.log(currentUser)

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
