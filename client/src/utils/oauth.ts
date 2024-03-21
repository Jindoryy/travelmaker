const kakaoRestKey = process.env.REACT_APP_KAKAO_REST_KEY
const redirectURI = process.env.REACT_APP_KAKAO_REDIRECT_URL;
const kakaoLocalRemoteURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestKey}&redirect_uri=http://localhost:3000${redirectURI}&response_type=code`;
const kakaoAuthRemoteURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestKey}&redirect_uri=http://i10a305.p.ssafy.io${redirectURI}&response_type=code`;

export {kakaoLocalRemoteURL, kakaoAuthRemoteURL};