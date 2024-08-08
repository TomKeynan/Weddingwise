import './window.css'; // Importing CSS for the component
import EmojiPicker from 'emoji-picker-react'; // Importing EmojiPicker component
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'; // Firebase Firestore functions
import { useState, useEffect, useRef } from 'react'; // React hooks
import { db } from '../../../fireBase/firebase'; // Firebase database configuration
import { useChatStore } from '../../../fireBase/chatStore';
import { useUserStore } from '../../../fireBase/userStore';
import upload from '../../../fireBase/upload'; // Custom upload function
import * as timeago from 'timeago.js'; // Timeago library for formatting timestamps
import he from 'timeago.js/lib/lang/he'; // Hebrew language support for timeago

// Register Hebrew locale for timeago
timeago.register('he', he);

function Window() {
  // Local state variables
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false); // Emoji picker state
  const [text, setText] = useState(""); // Message text state
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  // Getting current user and chat information from custom hooks
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  // Reference to the end of the chat messages for scrolling
  const endRef = useRef(null);

  // Scroll to the end of chat messages on component mount
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  console.log("Window");


  // Listen for changes to the current chat and update the local state
  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "chats", chatId),
      (res) => {
        setChat(res.data());
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      unSub();
    };
  }, [chatId]);

  // Handle emoji selection
  const handleEmoji = e => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  // Handle image selection for upload
  const handleImg = async (e) => {
    if (e.target.files[0]) {
      const selectedImg = {
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
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
          })
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
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
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
        })
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
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
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

  return (
    <div className="window">
      {/* Chat header with user info and action icons */}
      <div className="top">
        <div className='user'>
          <img src={user?.avatar || 'assets/chat_pics/avatar.png'} alt='' />
          <div className='texts'>
            <span>{user?.username}</span>
            {/* {תיאור} */}
            <p>{user?.description}</p> 
            </div>
        </div>
        {/* <div className='icons'>
          <img src='assets/chat_pics/phone.png' alt='' />
          <img src='assets/chat_pics/video.png' alt='' />
          <img src='assets/chat_pics/info.png' alt='' />
        </div> */}
      </div>

      {/* Chat messages */}
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={message.senderId === currentUser?.id
              ? "message own" : "message"}
            key={message?.createdAt}
          >
            <div className="texts">
              {message.img ? (
                <img src={message.img} alt='' />
              ) : (
                <p>{message.text}</p>
              )}
              <span>{timeago.format(message.createdAt.toDate(), 'he')}</span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div> {/* endRef is attached to this div */}
      </div>

      {/* Chat input and controls */}
      <div className="bottom">
        <div className='icons'>
          <label htmlFor="file">
            <img src='assets/chat_pics/img.png' alt='' />
          </label>
          <input
            type="file"
            id='file'
            style={{ display: "none" }}
            onChange={handleImg}
          />
          {/* <img src='assets/chat_pics/camera.png' alt='' />
          <img src='assets/chat_pics/mic.png' alt='' /> */}
        </div>
        <input
          type='text'
          placeholder={isCurrentUserBlocked || isReceiverBlocked
            ? "You cannot send a message"
            : 'Type a message...'}
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className='emoji'>
          <img
            src='assets/chat_pics/emoji.png'
            alt=''
            onClick={() => setOpen((prev) => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className='sendButton'
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  );
}

export default Window;
