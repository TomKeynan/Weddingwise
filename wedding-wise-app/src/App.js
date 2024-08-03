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
    ],
  },
  {
    element: <SupplierLayout />,
    children: [
      { path: "/suppliers", element: <SupplierLP /> },
      { path: "/supplier-signup", element: <SupplierSignUp /> },
      {
        path: "/supplier-private-Profile",
        element: <SupplierPrivateProfile />,
      },
      {
        path: "/supplier-public-Profile",
        element: <SupplierPublicProfile />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/supplier-login", element: <SupplierLogin /> },
]);

function App() {
  const { fetchUserInfo, setLoading,currentUser } = useUserStore();
  const {  changeChatStatus, isSeen, changeIsSeenStatus } =
  useChatStore();

  
  useEffect(() => {
    let authUnSub = null;
    let chatUnSub = null;

    const handleAuthChange = async (user) => {
      if (user?.uid) {
        setLoading(true);
        await fetchUserInfo(user.uid);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    const handleChatChange = (res) => {
      const chatsData = res.data();
      if (chatsData && Array.isArray(chatsData.chats)) {
        const hasUnseenChat = chatsData.chats.some((chat) => chat.isSeen === false);
        changeIsSeenStatus(!hasUnseenChat);
      }
    };

    authUnSub = onAuthStateChanged(auth, handleAuthChange);

    if (currentUser?.id) {
      chatUnSub = onSnapshot(doc(db, "userChats", currentUser.id), handleChatChange);
    }

    // Cleanup the listeners on component unmount
    return () => {
      if (authUnSub) {
        authUnSub();
      }
      if (chatUnSub) {
        chatUnSub();
      }
    };
  }, [fetchUserInfo, setLoading, changeIsSeenStatus, currentUser?.id]);


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
