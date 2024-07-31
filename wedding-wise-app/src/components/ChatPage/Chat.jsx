import React, { useEffect, useRef, useState } from 'react';
import Detail from './detail/Detail';
import Window from './window/Window';
import { useUserStore } from '../../fireBase/userStore';
import { useChatStore } from '../../fireBase/chatStore';
import ChatList from './chatList/ChatList';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../fireBase/firebase';
import './chat.css';
import Loading from '../Loading';

function Chat() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { resetChat, chatId, changeChatStatus } = useChatStore();

  const chatRef = useRef(null);

  // Whats better? 
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (chatRef.current && !chatRef.current.contains(event.target)) {
  //       changeChatStatus();
  //       resetChat();
  //     }
  //   };

  //   // Add event listener
  //   document.addEventListener('mousedown', handleClickOutside);

  //   // Cleanup function to remove event listener
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [chatRef]);


  const [isCoupleConnected, setIsCoupleConnected] = useState(false);

  const [hasChats, setHasChats] = useState(false);

  useEffect(() => {


    const currentCouple = sessionStorage.getItem("currentCouple");
    if (currentCouple) {
      setIsCoupleConnected(true);
    } else {
      setIsCoupleConnected(false);
    }


    // Set up a Firestore onSnapshot listener for user chats
    const unsub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (docSnapshot) => {
        const chatData = docSnapshot.data();
        if (chatData && chatData.chats && chatData.chats.length > 0) {
          setHasChats(true);
        } else {
          setHasChats(false);
        }
      });
    // Clean up the onSnapshot listener on component unmount
    return () => {
      unsub();
    };
  }, [currentUser?.id]);


  // Main return statement of the component
  return (
    isLoading ? (
      <Loading />
    ) : (
    <div className="chat" ref={chatRef}>
 <button onClick={() => changeChatStatus()} className="exit-button">
            &#10005;
          </button>
      {currentUser ? (
        <>
         
          {hasChats ? (
            <>
              <ChatList />
              {chatId && <Window />}
              {chatId && <Detail />}
            </>
          ) : (
            isCoupleConnected ? (
              <div>
                <p className="paragraph">
                  על מנת להשתמש בצ'אט, אתם צריכים קודם להשיג את נבחרת הספקים המושלמת עבורכם!
                </p>
                <Link
                  to={'/package'}
                  className="button-link"
                  onClick={() => { changeChatStatus(); }}
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
            )
          )}
        </>
      ) : (
        <p>Please log in to access this section.</p>
      )}
    </div>)
  );

};




export default Chat;


