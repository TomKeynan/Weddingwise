import React, { useEffect, useState } from 'react'; // Import React and necessary hooks
import './chatList.css'; // Import CSS for styling
import { useUserStore } from '../../../fireBase/userStore'; // Import user store hook
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from '../../../fireBase/firebase'; // Import Firestore database instance
import { useChatStore } from '../../../fireBase/chatStore'; // Import chat store hook

function ChatList() {
    // State variables for storing chats, add mode status, and input value
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");

    const { currentUser } = useUserStore(); // Get the current user from the user store
    const { changeChat } = useChatStore(); // Get the changeChat function from the chat store

    useEffect(() => {
        // Set up a Firestore onSnapshot listener for user chats
        const unsub = onSnapshot(
            doc(db, "userChats", currentUser.id),
            async (res) => {
                const chatList = res.data().chats; // Retrieve the list of chats

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
            });

        // Clean up the onSnapshot listener on component unmount
        return () => {
            unsub();
        }
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
    const filteredChats = chats.filter(c =>
        c.user.username.toLowerCase().includes(input.toLowerCase())
    );

    const listStyle = {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
    };

    return (

        <div style={listStyle}>

            <div className="user-info">
                <div className="user">
                    <img className="img-avatar" src={currentUser.avatar || 'assets/chat_pics/avatar.png'} alt='' />
                    <h2>{currentUser.username}</h2>
                </div>
                <div className="icons">
                    <img className="img-icons" src='assets/chat_pics/more.png' alt='' />
                    <img className="img-icons" src='assets/chat_pics/video.png' alt='' />
                    <img className="img-icons" src='assets/chat_pics/edit.png' alt='' />
                </div>
            </div>

            <div className="chat-list">
                {/* Search bar and add user button */}
                <div className="search">
                    <div className="search-bar">
                        <img className="imgs-search" src="assets/chat_pics/search.png" alt="" />
                        <input
                            className="input"
                            type="text"
                            placeholder="Search"
                            onChange={(e) => setInput(e.target.value)} />
                    </div>
                </div>

                {/* Render the list of filtered chats */}
                {filteredChats?.map((chat) => (
                    <div
                        className="item"
                        key={chat.chatId}
                        onClick={() => handleSelect(chat)}
                        style={{
                            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
                        }}
                    >
                        <img
                            className="img-avatar"
                            src={
                                chat.user.blocked.includes(currentUser.id)
                                    ? "assets/chat_pics/avatar.png"
                                    : chat.user.avatar || "assets/chat_pics/avatar.png"
                            }
                            alt=""
                        />
                        <div className="texts">
                            <span className="span">
                                {chat.user.blocked.includes(currentUser.id)
                                    ? "User"
                                    : chat.user.username}</span>
                            <p className="p">{chat.lastMessage}</p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default ChatList;
