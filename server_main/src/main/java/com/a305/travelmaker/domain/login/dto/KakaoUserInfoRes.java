package com.a305.travelmaker.domain.login.dto;

import lombok.Getter;

@Getter
public class KakaoUserInfoRes {


    private Long id; //범위가 int 초과
    private KakaoAccount kakao_account;

    @Getter
    static public class KakaoAccount {

        private String email;
        private Profile profile;

        @Getter
        static public class Profile {

            private String nickname;
            private String profile_image_url;
        }
    }

}
