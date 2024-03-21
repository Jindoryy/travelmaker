import { create } from 'zustand';

interface userInfoType {
    userId : number
    profileUrl: string
    nickName: string
}

interface UserInfoState {
    userInfo: userInfoType
}

interface UserInfoActions {
    setUserInfo: (userinfo: userInfoType) => void
    deleteUserInfo: () => void
}

const defaultState = { userId: -1, profileUrl: '', nickName: '' }

const useUserInfo  = create<UserInfoState & UserInfoActions>((set) => ({
    userInfo: defaultState,
    setUserInfo: (userInfo: userInfoType) => {set({ userInfo })},
    deleteUserInfo: () => {set({userInfo: defaultState})}
}))

export default useUserInfo