# 기능명세서

### 1. 회원가입
- 카카오 소셜 가입
```
카카오 이메일(varchar 100)
프로필 사진(varchar1000)
이름(varchar 50)
성별 (varchar 50)
연령대 (int)
생일 (Date ⇒ YYYY-MM-DD)
```

### 2. 로그인
- 카카오 소셜 로그인
```
[ Server ]
기능 1 : 로그인시 Access Token, Refresh Token 발급
기능 2 : Refresh Token DB에 저장
기능 3 : User 객체 + Flag 값(현재 어느 페이지로 리다이렉트로 갈지)
Flag : 0 (메인-코스전), 1 (메인-코스후), 2(메인-여행중)
선택 기능 1 : Refresh Token Redis 캐싱 처리 

[ Client ] 
기능 1 : 로그인시 반환되는  Access Token, Refresh Token Local Stroage 에 저장 및 상태관리 Store에 저장
```
