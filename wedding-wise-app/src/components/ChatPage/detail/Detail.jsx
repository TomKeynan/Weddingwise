import React from 'react'
import './detail.css';
import { auth, db } from '../../../fireBase/firebase';
import { useChatStore } from '../../../fireBase/chatStore';
import { useUserStore } from '../../../fireBase/userStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';


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
    <div className='detail'>

      <div className="user">
        <img src={user?.avatar || 'assets/chat_pics/avatar.png'} alt='' />
        <h2>{user?.username} </h2>
        {/* {תיאור} */}
        <p>{user?.description}</p>
      </div>
      {/* {all down needed? needed?} */}
      <div className="info">

        {/* <div className="option">
          <div className="title">
            <span>הגדרות</span>
            <img src='assets/chat_pics/arrowUp.png' alt='' />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>פרטיות ועזרה</span>
            <img src='assets/chat_pics/arrowUp.png' alt='' />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>אלכוהול, סמים, נשקים</span>
            <img src='assets/chat_pics/arrowUp.png' alt='' />
          </div>
        </div> */}

        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
              ? "User blocked"
              : "Block User"}
        </button>
      </div>
    </div>
  )
}

export default Detail
