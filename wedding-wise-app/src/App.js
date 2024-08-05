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
import Finance from "./Pages/Finance";
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
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./fireBase/firebase";
import { useChatStore } from "./fireBase/chatStore";

import PlannerLP from "./Pages/PlannerLP";
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
      { path: "finance", element: <Finance /> },
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
  const { changeIsSeenStatus } = useChatStore();


  useEffect(() => {


    // Function to handle fetching user info and setting loading state
    const handleAuthStateChanged = async (user) => {
      if (user?.uid) {
        setLoading(true);
        await fetchUserInfo(user.uid);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    // Set up the authentication state change listener
    const unSubAuth = onAuthStateChanged(auth, handleAuthStateChanged);

    // Set up the listener for changes to the current chat
    let unSubChat = null;
    if (currentUser?.id) {
      unSubChat = onSnapshot(doc(db, "userChats", currentUser.id), (res) => {
        const chatsData = res.data();
        if (chatsData && Array.isArray(chatsData.chats)) {
          const hasUnseenChat = chatsData.chats.some(
            (chat) => chat.isSeen === false
          );
          changeIsSeenStatus(!hasUnseenChat);
        }
      });
    }

    // Cleanup function to unsubscribe from both listeners
    return () => {
      if (unSubAuth) {
        unSubAuth();
      }
      if (unSubChat) {
        unSubChat();
      }
    };
  }, [fetchUserInfo, setLoading]);


  console.log(currentUser);
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
