import React, { useEffect, useState } from "react";
import "./chatList.css";
import { useUserStore } from "../../../fireBase/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../fireBase/firebase";
import { useChatStore } from "../../../fireBase/chatStore";
import { Box, Stack, Typography } from "@mui/material";

function ChatList() {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        const chatList = res.data().chats;

        // Retrieve user data for each chat asynchronously
        const promises = chatList?.map(async (chat) => {
          const userDocRef = doc(db, "users", chat.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...chat, user };
        });

        // Resolve all promises and sort chats by update time
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    // Clean up the onSnapshot listener on component unmount
    return () => {
      unsub();
    };
  }, [currentUser?.id]);

  const handleSelect = async (chat) => {
    // Mark the selected chat as seen

    const userChats = chats?.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;
    const userChatsRef = doc(db, "userChats", currentUser.id);

    try {
      // Update Firestore with the modified chat data
      await updateDoc(userChatsRef, {
        chats: userChats,
      });

      // Change the current chat to the selected one
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  // Filter chats based on input value
  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <Stack sx={{ width: "100%" }}>
      <Stack sx={{ p: { xs: 1, sm: 3 }, rowGap: 2 }}>
        {/* names and avatar */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ gap: { xs: 1, sm: 3 } }}
        >
          <Box
            sx={{
              border: "1px solid black",
              width: 50,
              height: 50,
              borderRadius: "50%",
            }}
          >
            <Box
              component="img"
              src={currentUser.avatar || "assets/chat_pics/avatar.png"}
              alt="Supplier Avatar"
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </Box>
          <Typography
            sx={{ color: "white", typography: { xs: "h6", sm: "h4" } }}
          >
            {currentUser.username}
          </Typography>
        </Stack>
        {/* search bar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            p: 3,
            bgcolor: "rgba(17, 25, 40, 0.7)",
            borderRadius: 2,
            padding: 2,
          }}
        >
          <input
            className="input"
            type="text"
            placeholder="חיפוש"
            style={{
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              direction: "rtl",
              width: "100%",
            }}
            onChange={(e) => setInput(e.target.value)}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bottom: { xs: "-20%", sm: "-40%" },
            }}
          >
            <Box
              component="img"
              src="assets/chat_pics/search.png"
              alt="Supplier Avatar"
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Stack>
      </Stack>

      {/* Render the list of filtered chats */}
      <Stack
        justifyContent="center"
        sx={{ width: "90%", p: { xs: 1, sm: 3 }, mx: "auto" }}
      >
        {filteredChats?.map((chat) => (
          <Stack
            direction="row"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            sx={{
              textAlign: "left",
              p: 2,
              my:1,
              columnGap: 2,
              color: "white",
              borderBottom: " 1px solid #dddddd35",
              borderRadius: "3px 3px 0",
              cursor: "pointer",
            }}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <Box
              sx={{
                border: "1px solid black",
                width: 50,
                height: 50,
                borderRadius: "50%",
              }}
            >
              <Box
                component="img"
                src={
                  chat.user.blocked.includes(currentUser.id)
                    ? "assets/chat_pics/avatar.png"
                    : chat.user.avatar || "assets/chat_pics/avatar.png"
                }
                alt=""
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box>
              <Typography sx={{ mb: 1 }}>
                {chat.user.blocked.includes(currentUser.id)
                  ? "User"
                  : chat.user.username}
              </Typography>
              <Typography sx={{ mt: 1 }}>{chat.lastMessage}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default ChatList;

// import React, { useEffect, useState } from 'react';
// import './chatList.css';
// import { useUserStore } from '../../../fireBase/userStore';
// import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
// import { db } from '../../../fireBase/firebase';
// import { useChatStore } from '../../../fireBase/chatStore';

// function ChatList() {
//     const [chats, setChats] = useState([]);
//     const [addMode, setAddMode] = useState(false);
//     const [input, setInput] = useState("");

//     const { currentUser } = useUserStore();
//     const { changeChat } = useChatStore();

//     useEffect(() => {

//         const unsub = onSnapshot(
//             doc(db, "userChats", currentUser.id),
//             async (res) => {
//                 const chatList = res.data().chats;

//                 // Retrieve user data for each chat asynchronously
//                 const promises = chatList?.map(async (chat) => {
//                     const userDocRef = doc(db, "users", chat.receiverId);
//                     const userDocSnap = await getDoc(userDocRef);
//                     const user = userDocSnap.data();
//                     return { ...chat, user };
//                 });

//                 // Resolve all promises and sort chats by update time
//                 const chatData = await Promise.all(promises);
//                 setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
//             });

//         // Clean up the onSnapshot listener on component unmount
//         return () => {
//             unsub();
//         }
//     }, [currentUser?.id]);

//     const handleSelect = async (chat) => {
//         // Mark the selected chat as seen

//         const userChats = chats?.map((item) => {
//             const { user, ...rest } = item;
//             return rest;
//         });

//         const chatIndex = userChats.findIndex(
//             (item) => item.chatId === chat.chatId
//         );

//         userChats[chatIndex].isSeen = true;
//         const userChatsRef = doc(db, "userChats", currentUser.id);

//         try {
//             // Update Firestore with the modified chat data
//             await updateDoc(userChatsRef, {
//                 chats: userChats,
//             });

//             // Change the current chat to the selected one
//             changeChat(chat.chatId, chat.user);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     // Filter chats based on input value
//     const filteredChats = chats.filter(c =>
//         c.user.username.toLowerCase().includes(input.toLowerCase())
//     );

//     const listStyle = {
//         flex: '1',
//         display: 'flex',
//         flexDirection: 'column',
//     };

//     return (

//         <div style={listStyle}>

//             <div className="user-info">
//                 <div className="user">
//                     <img className="img-avatar" src={currentUser.avatar || 'assets/chat_pics/avatar.png'} alt='' />
//                     <h2>{currentUser.username}</h2>
//                 </div>
//                 {/* <div className="icons">
//                     <img className="img-icons" src='assets/chat_pics/more.png' alt='' />
//                     <img className="img-icons" src='assets/chat_pics/video.png' alt='' />
//                     <img className="img-icons" src='assets/chat_pics/edit.png' alt='' />
//                 </div> */}
//             </div>

//             <div className="chat-list">
//                 {/* Search bar and add user button */}
//                 <div className="search">
//                     <div className="search-bar">
//                         <img className="imgs-search" src="assets/chat_pics/search.png" alt="" />
//                         <input
//                             className="input"
//                             type="text"
//                             placeholder="Search"
//                             onChange={(e) => setInput(e.target.value)} />
//                     </div>
//                 </div>

//                 {/* Render the list of filtered chats */}
//                 {filteredChats?.map((chat) => (
//                     <div
//                         className="item"
//                         key={chat.chatId}
//                         onClick={() => handleSelect(chat)}
//                         style={{
//                             backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
//                         }}
//                     >
//                         <img
//                             className="img-avatar"
//                             src={
//                                 chat.user.blocked.includes(currentUser.id)
//                                     ? "assets/chat_pics/avatar.png"
//                                     : chat.user.avatar || "assets/chat_pics/avatar.png"
//                             }
//                             alt=""
//                         />
//                         <div className="texts">
//                             <span className="span">
//                                 {chat.user.blocked.includes(currentUser.id)
//                                     ? "User"
//                                     : chat.user.username}</span>
//                             <p className="p">{chat.lastMessage}</p>
//                         </div>
//                     </div>
//                 ))}

//             </div>
//         </div>
//     );
// }

// export default ChatList;
