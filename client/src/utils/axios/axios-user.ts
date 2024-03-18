import { AxiosResponse } from "axios";
import instance from "./axios-instance";

interface KakaoAuthResponse {
    accessToken: string;
    // 응답에 포함된 다른 필드들도 여기에 추가하세요.
}

const kakaoauthentication = (code: string): Promise<AxiosResponse<KakaoAuthResponse>> => {
    return instance.post<KakaoAuthResponse>('login/oauth2/code/kakao', { code });
}

export { kakaoauthentication };