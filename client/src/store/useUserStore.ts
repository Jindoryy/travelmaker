import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
    userId: number;
    profileUrl: string;
    nickName: string;
}

interface UserInfoState {
    userInfo: UserInfo;
    setUserInfo: (userInfo: UserInfo) => void;
    clearUserInfo: () => void;
}

const initialState = { userId: -1, profileUrl: '', nickName: '' }

const useUserInfo  = create(
    persist<UserInfoState>(
    (set) => ({
        userInfo: initialState,
        setUserInfo: (userInfo) => set({ userInfo }),
        clearUserInfo: () => set({ userInfo: initialState}),
    }),
    {
        name: "userInfo",
        getStorage: () => localStorage,
    }
    )
)

export default useUserInfo