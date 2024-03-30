import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
        // 사용자 정보 설정 함수
        setUserInfo: (userInfo) => {
            console.log("setUserInfo 호출 전 상태:", userInfo);
            set({ userInfo });
            console.log("setUserInfo 호출 후 상태:", userInfo);
        },
        // 사용자 정보 초기화 함수
        clearUserInfo: () => {
            set({ userInfo: initialState });
        },
    }),
    {
        name: "userInfo",
    }
    )
);


export default useUserInfo;
