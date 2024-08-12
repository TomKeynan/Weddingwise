import React, { useEffect, useState, useContext } from "react";
import Window from "./window/Window";
import { useUserStore } from "../../fireBase/userStore";
import { useChatStore } from "../../fireBase/chatStore";
import ChatList from "./chatList/ChatList";
import { Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../fireBase/firebase";
import "./chat.css";
import Loading from "../Loading";
import { getAuth } from "firebase/auth";
import { AppContext } from "../../store/AppContext";
import { Navigate } from "react-router-dom";
import { Box, Stack, useMediaQuery } from "@mui/material";
function Chat() {
  const screenUnderMD = useMediaQuery("(max-width: 900px)");
  const { currentUser} = useUserStore();
  const { chatId, changeChatStatus, isScrollableY } = useChatStore();
  const auth = getAuth();
  
  const { coupleData, supplierData } = useContext(AppContext);

  const [hasChats, setHasChats] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      // Set up a Firestore onSnapshot listener for user chats
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser.id),
        async (docSnapshot) => {
          const chatData = docSnapshot?.data();
          if (chatData && chatData?.chats && chatData?.chats?.length > 0) {
            setHasChats(true);
          } else {
            setHasChats(false);
          }
        }
      );
      return () => {
        unsub();
      };
    }
  }, [currentUser?.id]);

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return !currentUser ? (
    <Loading />
  ) : (
    <Stack
      direction={!chatId ? "column" : "row"}
      sx={{
        position: "fixed",
        width: "75%",
        maxHeight: "77vh",
        minHeight: "77vh",
        bgcolor: "rgba(17, 25, 40, 0.9)",
        borderRadius: 3,
        top: "14%",
        right: "13%",
        zIndex: 10,
        p: 1,
        fontFamily:
          "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', Geneva, Verdana, sans-serif",
        textAlign: "right",
        overflowY: isScrollableY ? "scroll" : "hidden",  
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(17, 25, 40, 0.8)", // Thumb color
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(17, 25, 40, 1)", // Thumb hover color
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1", // Track color
        },
      }}
    >
      <Box onClick={() => changeChatStatus()} className="exit-button">
        &#10005;
      </Box>
      {coupleData || supplierData ? (
        <>
          {hasChats ? (
            <>
              {!chatId && <ChatList />}
              {chatId && <Window />}
            </>
          ) : coupleData ? (
            <div>
              <p className="paragraph">
                על מנת להשתמש בצ'אט, אתם צריכים קודם להשיג את נבחרת הספקים
                המושלמת עבורכם!
              </p>
              <Link
                to={"/package"}
                className="button-link"
                onClick={() => {
                  changeChatStatus();
                }}
              >
                השיגו חבילה כעת!
              </Link>
            </div>
          ) : (
            <div>
              <p className="paragraph">
                על מנת להשתמש בצ'אט, על זוג ליצור אתכם קשר!
              </p>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to access this section.</p>
      )}
    </Stack>
  );
}

export default Chat;

