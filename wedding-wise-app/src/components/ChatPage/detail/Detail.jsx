import React from 'react'
import './detail.css';
import { auth, db } from '../../../fireBase/firebase';
import { useChatStore } from '../../../fireBase/chatStore';
import { useUserStore } from '../../../fireBase/userStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { Stack } from '@mui/material';


function Detail() {

  const {
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();

  const { currentUser } = useUserStore();


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



  return (
    <Stack>
      <div className="user">
        <img src={user?.avatar || 'assets/chat_pics/avatar.png'} alt='' />
        <h2>{user?.username} </h2>
        {/* {תיאור} */}
        <p>{user?.description}</p>
      </div>
      {/* {all down needed? needed?} */}
      <div className="info">

        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
              ? "User blocked"
              : "Block User"}
        </button>
      </div>
    </Stack>
  )
}

export default Detail
