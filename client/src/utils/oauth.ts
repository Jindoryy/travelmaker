const kakaoRestKey = process.env.REACT_APP_KAKAO_REST_KEY
const kakaoLocalRemoteURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestKey}&redirect_uri=http://localhost:3000/login/oauth2/code/kakao&response_type=code`;
const kakaoAuthRemoteURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestKey}&redirect_uri=https://j10a305.p.ssafy.io/login/oauth2/code/kakao&response_type=code`;

export {kakaoLocalRemoteURL, kakaoAuthRemoteURL};