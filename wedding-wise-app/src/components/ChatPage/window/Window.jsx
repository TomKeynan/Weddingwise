import "./window.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { db } from "../../../fireBase/firebase";
import { useChatStore } from "../../../fireBase/chatStore";
import { useUserStore } from "../../../fireBase/userStore";
import upload from "../../../fireBase/upload";
import TimeAgo from "react-timeago";
import heStrings from "react-timeago/lib/language-strings/he";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { arrayRemove } from "firebase/firestore";

const formatter = buildFormatter(heStrings);

function Window() {
  const screenUnderSM = useMediaQuery("(max-width: 600px)");
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    goBack,
  } = useChatStore();

  // Reference to the end of the chat messages for scrolling
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Listen for changes to the current chat and update the local state
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    // Cleanup the listener on component unmount
    return () => {
      unSub();
    };
  }, [chatId]);

  // Handle emoji selection
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  // Handle image selection for upload
  const handleImg = async (e) => {
    if (e.target.files[0]) {
      const selectedImg = {
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      };
      setImg(selectedImg);

      let imgUrl = null;
      try {
        // Upload image
        imgUrl = await upload(selectedImg.file);

        // Send image message
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            createdAt: new Date(),
            img: imgUrl,
          }),
        });

        const userIDs = [currentUser.id, user.id];

        // Update userChats document for each user involved in the chat
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "userChats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          // if the user's chats are found
          if (userChatsSnapshot.exists()) {
            // get the chats
            const userChatsData = userChatsSnapshot.data();

            // look for the chat that needs updating
            const chatIndex = userChatsData.chats.findIndex(
              (c) => c.chatId === chatId
            );

            // update the specific chat
            userChatsData.chats[chatIndex].lastMessage = "Image";
            userChatsData.chats[chatIndex].isSeen =
              id === currentUser.id ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          }
        });
      } catch (err) {
        console.log(err);
      }

      // Reset image state
      setImg({
        file: null,
        url: "",
      });
    }
  };

  // Handle sending a message
  const handleSend = async () => {
    if (text === "") return;

    try {
      // Update the chat document in Firestore with the new message
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      // Update userChats document for each user involved in the chat
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        // if the user's chats are found
        if (userChatsSnapshot.exists()) {
          // get the chats
          const userChatsData = userChatsSnapshot.data();

          // look for the chat that needs updating
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          // update the specific chat
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }

    // Reset text state
    setText("");
  };

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  function renderMessageByCurrentUser(message) {
    let messageBgColor = {};
    let alignment = "";
    if (message.senderId === currentUser?.id) {
      messageBgColor = {
        bgcolor: "info.light",
      };
      alignment = "flex-end";
    } else {
      messageBgColor = {
        bgcolor: "info.dark",
      };
      alignment = "flex-start";
    }
    return (
      <Stack alignItems={alignment} key={message?.createdAt}>
        <Stack alignItems={alignment} sx={{ textAlign: "left" }}>
          {message.img ? (
            <Box
              sx={{
                border: "1px solid black",
                width: 250,
                height: 250,
              }}
            >
              <Box
                component="img"
                src={message.img}
                alt=""
                sx={{
                  width: 250,
                  height: 250,
                  objectFit: "cover",
                }}
              />
            </Box>
          ) : (
            <Typography
              sx={{
                ...messageBgColor,
                color: "white",
                borderRadius: 2,
                textAlign: "left",
                maxWidth: "fit-content",
                p: { xs: 1, sm: 2 },
                fontSize: { xs: 13, sm: 16 },
              }}
            >
              {message.text}
            </Typography>
          )}
          <Typography
            sx={{
              color: "white",
              py: 0.7,
              textAlign: "left",
              // px: 2.5,
              px: { xs: 1, sm: 2 },
              fontSize: { xs: 13, sm: 16 },
            }}
          >
            <TimeAgo date={message.createdAt.toDate()} formatter={formatter} />
          </Typography>
        </Stack>
      </Stack>
    );
  }

  function rearrangeHeaderWindowElements() {
    if (!screenUnderSM) {
      return (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            columnGap: 2,
            borderBottom: "1px solid #dddddd35",
            p: 3,
            mt: 3,
          }}
        >
          {/* go back to menu btn */}
          <Stack>
            <Button
              variant="contained"
              color="info"
              startIcon={<ArrowForwardIcon />}
              onClick={goBack}
              sx={{
                p: 1,

                fontSize: 14,
                "& .MuiSvgIcon-root": {
                  fontSize: 14,
                },
                "&:hover": {
                  bgcolor: "info.dark",
                },
              }}
            >
              חזור
            </Button>
          </Stack>
          {/* avatar & name & description */}
          <Stack direction="row" alignItems="center" sx={{ columnGap: 2 }}>
            <Box
              sx={{
                border: "1px solid black",
                width: 60,
                height: 60,
                borderRadius: "50%",
              }}
            >
              <Box
                component="img"
                src={user?.avatar || "assets/chat_pics/avatar.png"}
                alt=""
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Stack>
              <Typography
                sx={{
                  color: "white",
                  typography: "h5",
                  textAlign: "left",
                }}
              >
                {user?.username}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  typography: "h6",
                  textAlign: "left",
                }}
              >
                {user?.description}
              </Typography>
            </Stack>
          </Stack>
          {/* block user btn */}
          <Stack>
            <Button
              variant="contained"
              sx={{
                bgcolor: "error.main",
                p: 1,
                fontSize: 14,
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
              onClick={handleBlock}
            >
              {isCurrentUserBlocked
                ? "נחסמת"
                : isReceiverBlocked
                ? "משתמש חסום"
                : "חסום משתמש"}
            </Button>
          </Stack>
        </Stack>
      );
    } else {
      return (
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{
            rowGap: 2,
            borderBottom: "1px solid #dddddd35",
            p: 2,
          }}
        >
          {/* avatar & name & description */}
          <Stack direction="row" alignItems="center" sx={{ columnGap: 1 }}>
            <Box
              sx={{
                border: "1px solid black",
                width: 45,
                height: 45,
                borderRadius: "50%",
              }}
            >
              <Box
                component="img"
                src={user?.avatar || "assets/chat_pics/avatar.png"}
                alt=""
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Stack>
              <Typography
                sx={{
                  color: "white",
                  typography: "body1",
                  textAlign: "left",
                }}
              >
                {user?.username}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  typography: "body2",
                  textAlign: "left",
                }}
              >
                {user?.description}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* go back to menu btn */}
            <Stack>
              <Button
                variant="contained"
                color="info"
                startIcon={<ArrowForwardIcon />}
                onClick={goBack}
                sx={{
                  p: 0.5,
                  fontSize: 12,
                  "& .MuiSvgIcon-root": {
                    fontSize: 12,
                  },
                  "&:hover": {
                    bgcolor: "info.dark",
                  },
                }}
              >
                חזור
              </Button>
            </Stack>

            {/* block user btn */}
            <Stack>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "error.main",
                  p: 0.5,
                  fontSize: 12,
                  "&:hover": {
                    bgcolor: "error.dark",
                  },
                }}
                onClick={handleBlock}
              >
                {isCurrentUserBlocked
                  ? "נחסמת"
                  : isReceiverBlocked
                  ? "משתמש חסום"
                  : "חסום משתמש"}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      );
    }
  }
  return (
    <Stack
      sx={{
        height: "100%",
        borderLeft: "1px solid #dddddd35",
        borderRight: "1px solid #dddddd35",
        flexGrow: 1,
      }}
    >
      {/* Chat header with user info and action icons */}
      {rearrangeHeaderWindowElements()}

      {/* Chat messages */}
      <Stack sx={messagesWindowSX}>
        {chat?.messages?.map((message) => renderMessageByCurrentUser(message))}
        <div ref={endRef}></div> {/* endRef is attached to this div */}
      </Stack>

      {/* Chat input and controls */}
      <Grid
        container
        sx={{
          rowGap: 2,
          columnGap: 1,
          px: { xs: 1, sm: 3 },
          pt: { xs: 1, sm: 3 },
          pb: 0,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* picture input */}

        <Grid item xs={1} sm={0.5} lg={1} sx={ChatControllersSX}>
          <Box>
            <label htmlFor="file">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  // borderRadius: "50%",
                }}
              >
                <Box
                  component="img"
                  src="assets/chat_pics/img.png"
                  alt=""
                  sx={{
                    width: 20,
                    height: 20,
                    // borderRadius: "50%",
                    objectFit: "cover",
                    cursor:
                      isCurrentUserBlocked || isReceiverBlocked
                        ? "not-allowed"
                        : "pointer",
                  }}
                />
              </Box>
            </label>
            <input
              type="file"
              id="file"
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              style={{ display: "none" }}
              onChange={handleImg}
            />
          </Box>
        </Grid>
        {/* message input */}
        <Grid item xs={9} sm={8} lg={7} sx={ChatControllersSX}>
          <input
            type="text"
            placeholder={
              isCurrentUserBlocked || isReceiverBlocked
                ? "אינך יכול לשלוח הודעה"
                : "כתוב כאן..."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
            style={{
              backgroundColor: "black",
              border: "none",
              outline: "none",
              color: "white",
              direction: "rtl",
              width: "50%",
              padding: "16px",
              borderRadius: "5px",
              width: "100%",
            }}
          />
        </Grid>
        {/* emoji */}
        <Grid item xs={1} sm={0.5} lg={1} sx={ChatControllersSX}>
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                width: 20,
                height: 20,
              }}
            >
              <Box
                component="img"
                src="assets/chat_pics/emoji.png"
                alt=""
                onClick={() =>
                  !isCurrentUserBlocked &&
                  !isReceiverBlocked &&
                  setOpen((prev) => !prev)
                }
                sx={{
                  width: 20,
                  height: 20,
                  objectFit: "cover",
                  cursor:
                    isCurrentUserBlocked || isReceiverBlocked
                      ? "not-allowed"
                      : "pointer",
                }}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 50,
                right: 150,
                width: "100%",
              }}
            >
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </Box>
          </Box>
        </Grid>
        {/* send button */}
        <Grid item xs={12} sm={2} lg={2} sx={ChatControllersSX}>
          <Button
            // className="sendButton"
            variant="contained"
            sx={{
              bgcolor: "#5183fe",
              color: "white",
              py: 1,
              px: 2.5,
              width: { xs: "100%", sm: "50%" },
              mx: "auto",
              border: "none",
              "&:hover": {
                bgcolor: "info.dark",
              },
            }}
            onClick={handleSend}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          >
            שלח
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default Window;

const messagesWindowSX = {
  p: 2,
  rowGap: 2,
  borderBottom: "1px solid #dddddd35",
  height: "45vh",
  overflowY: "scroll",
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(17, 25, 40, 0.8)", // Thumb color
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(17, 25, 40, 1)", // Thumb hover color
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#dddddd35", // Track color
  },
  direction: "rtl",
};

const ChatControllersSX = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

// import './window.css';
// import EmojiPicker from 'emoji-picker-react';
// import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
// import { useState, useEffect, useRef } from 'react';
// import { db } from '../../../fireBase/firebase';
// import { useChatStore } from '../../../fireBase/chatStore';
// import { useUserStore } from '../../../fireBase/userStore';
// import upload from '../../../fireBase/upload';
// import TimeAgo from 'react-timeago';
// import heStrings from 'react-timeago/lib/language-strings/he';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

// const formatter = buildFormatter(heStrings);

// function Window() {

//   const [chat, setChat] = useState();
//   const [open, setOpen] = useState(false);
//   const [text, setText] = useState("");
//   const [img, setImg] = useState({
//     file: null,
//     url: "",
//   });

//   const { currentUser } = useUserStore();
//   const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

//   // Reference to the end of the chat messages for scrolling
//   const endRef = useRef(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat?.messages]);

//   // console.log("Window");

//   // Listen for changes to the current chat and update the local state
//   useEffect(() => {
//     const unSub = onSnapshot(
//       doc(db, "chats", chatId),
//       (res) => {
//         setChat(res.data());
//       }
//     );

//     // Cleanup the listener on component unmount
//     return () => {
//       unSub();
//     };
//   }, [chatId]);

//   // Handle emoji selection
//   const handleEmoji = e => {
//     setText((prev) => prev + e.emoji);
//     setOpen(false);
//   };

//   // Handle image selection for upload
//   const handleImg = async (e) => {
//     if (e.target.files[0]) {
//       const selectedImg = {
//         file: e.target.files[0],
//         url: URL.createObjectURL(e.target.files[0])
//       };
//       setImg(selectedImg);

//       let imgUrl = null;
//       try {
//         // Upload image
//         imgUrl = await upload(selectedImg.file);

//         // Send image message
//         await updateDoc(doc(db, "chats", chatId), {
//           messages: arrayUnion({
//             senderId: currentUser.id,
//             createdAt: new Date(),
//             img: imgUrl,
//           })
//         });

//         const userIDs = [currentUser.id, user.id];

//         // Update userChats document for each user involved in the chat
//         userIDs.forEach(async (id) => {
//           const userChatsRef = doc(db, "userChats", id);
//           const userChatsSnapshot = await getDoc(userChatsRef);

//           // if the user's chats are found
//           if (userChatsSnapshot.exists()) {
//             // get the chats
//             const userChatsData = userChatsSnapshot.data();

//             // look for the chat that needs updating
//             const chatIndex = userChatsData.chats.findIndex(
//               (c) => c.chatId === chatId
//             );

//             // update the specific chat
//             userChatsData.chats[chatIndex].lastMessage = "Image";
//             userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
//             userChatsData.chats[chatIndex].updatedAt = Date.now();

//             await updateDoc(userChatsRef, {
//               chats: userChatsData.chats,
//             });
//           }
//         });
//       } catch (err) {
//         console.log(err);
//       }

//       // Reset image state
//       setImg({
//         file: null,
//         url: "",
//       });
//     }
//   };

//   // Handle sending a message
//   const handleSend = async () => {
//     if (text === "") return;

//     try {
//       // Update the chat document in Firestore with the new message
//       await updateDoc(doc(db, "chats", chatId), {
//         messages: arrayUnion({
//           senderId: currentUser.id,
//           text,
//           createdAt: new Date(),
//         })
//       });

//       const userIDs = [currentUser.id, user.id];

//       // Update userChats document for each user involved in the chat
//       userIDs.forEach(async (id) => {
//         const userChatsRef = doc(db, "userChats", id);
//         const userChatsSnapshot = await getDoc(userChatsRef);

//         // if the user's chats are found
//         if (userChatsSnapshot.exists()) {
//           // get the chats
//           const userChatsData = userChatsSnapshot.data();

//           // look for the chat that needs updating
//           const chatIndex = userChatsData.chats.findIndex(
//             (c) => c.chatId === chatId
//           );

//           // update the specific chat
//           userChatsData.chats[chatIndex].lastMessage = text;
//           userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
//           userChatsData.chats[chatIndex].updatedAt = Date.now();

//           await updateDoc(userChatsRef, {
//             chats: userChatsData.chats,
//           });
//         }
//       });
//     } catch (err) {
//       console.log(err);
//     }

//     // Reset text state
//     setText("");
//   };

//   return (
//     <div className="window">
//       {/* Chat header with user info and action icons */}
//       <div className="top">
//         <div className='user'>
//           <img src={user?.avatar || 'assets/chat_pics/avatar.png'} alt='' />
//           <div className='texts'>
//             <span>{user?.username}</span>
//             {/* {תיאור} */}
//             <p>{user?.description}</p>
//           </div>
//         </div>
//         {/* <div className='icons'>
//           <img src='assets/chat_pics/phone.png' alt='' />
//           <img src='assets/chat_pics/video.png' alt='' />
//           <img src='assets/chat_pics/info.png' alt='' />
//         </div> */}
//       </div>

//       {/* Chat messages */}
//       <div className="center">
//         {chat?.messages?.map((message) => (
//           <div
//             className={message.senderId === currentUser?.id
//               ? "message own" : "message"}
//             key={message?.createdAt}
//           >
//             <div className="texts">
//               {message.img ? (
//                 <img src={message.img} alt='' />
//               ) : (
//                 <p>{message.text}</p>
//               )}
//               <span>
//                 <TimeAgo date={message.createdAt.toDate()} formatter={formatter} />
//               </span>
//             </div>
//           </div>
//         ))}
//         <div ref={endRef}></div> {/* endRef is attached to this div */}
//       </div>

//       {/* Chat input and controls */}
//       <div className="bottom">
//         <div className='icons'>
//           <label htmlFor="file">
//             <img src='assets/chat_pics/img.png' alt='' />
//           </label>
//           <input
//             type="file"
//             id='file'
//             style={{ display: "none" }}
//             onChange={handleImg}
//           />
//           {/* <img src='assets/chat_pics/camera.png' alt='' />
//           <img src='assets/chat_pics/mic.png' alt='' /> */}
//         </div>
//         <input
//           type='text'
//           placeholder={isCurrentUserBlocked || isReceiverBlocked
//             ? "You cannot send a message"
//             : 'Type a message...'}
//           value={text}
//           onChange={e => setText(e.target.value)}
//           disabled={isCurrentUserBlocked || isReceiverBlocked}
//         />
//         <div className='emoji'>
//           <img
//             src='assets/chat_pics/emoji.png'
//             alt=''
//             onClick={() => setOpen((prev) => !prev)} />
//           <div className="picker">
//             <EmojiPicker open={open} onEmojiClick={handleEmoji} />
//           </div>
//         </div>
//         <button
//           className='sendButton'
//           onClick={handleSend}
//           disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default Window;
