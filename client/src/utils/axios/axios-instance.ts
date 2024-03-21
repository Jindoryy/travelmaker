import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
    baseURL:API_URL,
    headers: {
      'Content-Type': 'application/json',
      },
});

const oauthInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const formDataInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// 인증토큰 동적 할당을 위해서 인터셉터로 처리
const applyAuthTokenInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
};

applyAuthTokenInterceptor(oauthInstance);
applyAuthTokenInterceptor(formDataInstance);


export { instance, oauthInstance, formDataInstance };