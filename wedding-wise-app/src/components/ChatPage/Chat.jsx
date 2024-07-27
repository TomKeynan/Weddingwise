import React, { useEffect, useRef, useState } from 'react';
import Detail from './detail/Detail';
import Window from './window/Window';
import { useUserStore } from '../../fireBase/userStore';
import { useChatStore } from '../../fireBase/chatStore';
import ChatList from './chatList/ChatList';
import { Link } from 'react-router-dom';
import zIndex from '@mui/material/styles/zIndex';



function Chat() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { resetChat, chatId, changeChatStatus } = useChatStore();
  const [pck, setPackage] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        changeChatStatus();
        resetChat();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [chatRef]);



  useEffect(() => {
// need a case when a supplier is logged in.
    const storedCouple = sessionStorage.getItem("currentCouple");
    if (storedCouple) {
      const couple = JSON.parse(storedCouple);
      const storedPackage = couple.package;
      if (storedPackage) {
        setPackage(storedPackage);
      }
    }
  }, []);




  // Need To Add Case Of Supplier****

  
  // If the app is loading, display a loading indicator
  if (isLoading) return <div style={loadingStyle}>Loading...</div>;

  // Main return statement of the component
  return (
    <div className='chat' style={chatStyle} ref={chatRef}>
      {currentUser ? (
        <>
          {pck ? (
            <ChatList />
          ) : (
            <div>
              <p style={paragraphStyle}>
                על מנת להשתמש בצ'אט, אתם צריכים קודם להשיג את נבחרת הספקים המושלמת עבורכם!
              </p>
              <Link
                to={'/package'}
                style={buttonStyle}
                onClick={() => { changeChatStatus(); }}
                className="button-link"
              >
                השיגו חבילה כעת!
              </Link>
            </div>
          )}
          {chatId && <Window />}
          {chatId && <Detail />}
        </>
      ) : (
        <p>Please log in to access this section.</p> // or other content for logged out state
      )}
    </div>
  );
};




const chatStyle = {
  margin: '0 auto',
  color: 'white',
  width: '75vw',
  height: '82vh',
  backdropFilter: 'blur(19px) saturate(100%)',
  backgroundColor: 'rgba(17, 25, 40, 0.75)',
  borderRadius: '12px',
  display: 'flex',
  padding: '0',
  position: 'fixed',
  right: '12%',
  top: '13%',
  zIndex:2,
  boxSizing: 'border-box',
  fontFamily: 'Lucida Sans, Lucida Sans Regular, Lucida Grande, Geneva, Verdana, sans-serif',
  textAlign: 'right',
  justifyContent: 'center',
};

const loadingStyle = {
  padding: '50px',
  fontSize: '36px',
  borderRadius: '10px',
  backgroundColor: 'rgba(17, 25, 40, 0.9)',
};

const paragraphStyle = {
  fontSize: '25px',
  marginBottom: '20px',
  textAlign: 'center',
};

const buttonStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  fontSize: '25px',
  color: '#fff',
  width:'150px',
  height:'70px',
  backgroundColor: '#007bff',
  borderRadius: '5px',
  textDecoration: 'none',
  margin: '0',
  textAlign: 'center',
  transition: 'background-color 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  right: '40%',
  top: '11%',
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3',
};


export default Chat;
