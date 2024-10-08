import { create } from "zustand";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  chatStatus: false, // To be seen or not to be seen!
  isSeen: true,
  isScrollableY:true,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;
    set({ isScrollableY: false });
    // CHECK IF CURRENT USER IS BLOCKED
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    // CHECK IF RECEIVER IS BLOCKED
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },
  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
      chatStatus: false
    });
  },
  changeChatStatus: () => {
    set((state) => ({ ...state, chatStatus: !state.chatStatus }));
    useChatStore.getState().goBack(); // Call goBack
  },
  changeIsSeenStatus: (status) => {
    set({ isSeen: status });
  },
  goBack: () => {
    set({ chatId: null });
    set({ isScrollableY: true }); // Thats new
  },
}));
