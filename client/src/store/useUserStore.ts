import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserInfo {
  userId: number;
  profileUrl: string;
  nickName: string;
  tag: number;
}

interface UserInfoState {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
}

const initialState = { userId: -1, profileUrl: '', nickName: '', tag: -1 };

const useUserInfo = create(
  persist<UserInfoState>(
    (set) => ({
      userInfo: initialState,
      // 사용자 정보 설정 함수
      setUserInfo: (userInfo) => {
        set({ userInfo });
      },
      // 사용자 정보 초기화 함수
      clearUserInfo: () => {
        set({ userInfo: initialState });
      },
    }),
    {
      name: 'userInfo',
    },
  ),
);

export default useUserInfo;
