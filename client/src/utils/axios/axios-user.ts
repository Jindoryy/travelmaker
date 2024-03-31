import { AxiosResponse } from 'axios';
import { instance } from './axios-instance';

interface KakaoAuthResponse {
  status: string;
  data: {
    userId: number;
    nickName: string;
    profileUrl: string;
    status: string;
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  };
}

const kakaoauthentication = (code: string): Promise<AxiosResponse<KakaoAuthResponse>> => {
  return instance.post<KakaoAuthResponse>('login/oauth2/code/kakao', { code });
};

export { kakaoauthentication };
