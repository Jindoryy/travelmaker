package com.a305.travelmaker.global.common.jwt;

import static java.time.LocalDateTime.now;

import com.a305.travelmaker.domain.login.dto.OauthTokenRes;
import com.a305.travelmaker.domain.login.dto.UserDetail;
import com.a305.travelmaker.domain.login.dto.UserDetailAuthenticationToken;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.domain.user.repository.UserRepository;
import com.a305.travelmaker.global.common.exception.CustomException;
import com.a305.travelmaker.global.common.exception.ErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.sql.Timestamp;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;


@Slf4j
@Component
public class TokenProvider {

    private static final String AUTHORITIES_KEY = "auth";
    private static final String BEARER_TYPE = "bearer";
    private static final int ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 14; // 14일 임시
    private static final int REFRESH_TOKEN_EXPIRE_TIME =  1000 * 60 * 60 * 24 * 14;  // 14일 임시
    private static final String ISS = "http://kauth.kakao.com";

    private static final String AUD = "https://j10a305.p.ssafy.io/";
    private Key key;

    @Autowired
    private UserRepository userRepository;

    // application.yml에서 주입받은 secret 값을 base64 decode하여 key 변수에 할당
    public TokenProvider(@Value("${oauth2.jwt.secret}") String secret) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // Authentication 객체에 포함되어 있는 권한 정보들을 담은 토큰을 생성
    public OauthTokenRes generateTokenDto(User user) {
        long now = (new Date().getTime());

        //Access Toekn
        String accessToken = Jwts.builder()
            .claim("nickname", user.getNickname())
            .claim(AUTHORITIES_KEY, user.getRoles())
            .signWith(key, SignatureAlgorithm.HS512)
            .setIssuer(ISS)
            .setAudience(AUD)
            .setSubject(String.valueOf(user.getId()))
            .setIssuedAt(Timestamp.valueOf(now()))
            .setExpiration(new Date(now + ACCESS_TOKEN_EXPIRE_TIME))
            .compact();
        // Refresh Token 생성
        String refreshToken = Jwts.builder()
            .signWith(key, SignatureAlgorithm.HS512)
            .setIssuer(ISS)
            .setAudience(AUD)
            .setSubject(String.valueOf(user.getId()))
            .setIssuedAt(Timestamp.valueOf(now()))
            .setExpiration(new Date(now + REFRESH_TOKEN_EXPIRE_TIME))
            .compact();

        return OauthTokenRes.builder()
            .userId(user.getId())
            .nickName(user.getNickname())
            .profileUrl(user.getProfileUrl())
            .tag(user.getTag())
            .status(user.getStatus())
            .accessToken(accessToken)
            .tokenType(BEARER_TYPE)
            .expiresIn(ACCESS_TOKEN_EXPIRE_TIME - 1)
            .refreshToken(refreshToken)
            .refreshTokenExpiresIn(REFRESH_TOKEN_EXPIRE_TIME)
            .build();
    }

    public boolean tokenValidationCheck(String token) {
        try{
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new CustomException(ErrorCode.ACCESS_TOKEN_EXPIRE_ERROR);
        } catch (SecurityException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            throw new CustomException(ErrorCode.ACCESS_TOKEN_ERROR);
        }
    }

    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken)
                .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // Access 토큰을 복호화하여 검증
    // 검증 후 값 가져오는 로직은 아직 고민 중
    public UserDetailAuthenticationToken getAuthentication(String accessToken) {

        Claims claims = parseClaims(accessToken);

        if (claims.get(AUTHORITIES_KEY) == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        Collection<? extends GrantedAuthority> authorities =
            ((Collection<String>) claims.get(AUTHORITIES_KEY)).stream()
                .map(SimpleGrantedAuthority::new)
                .toList();

        Long userId = Long.valueOf(claims.getSubject());

        Optional<User> optionalUser = userRepository.findById(userId);
        User user = optionalUser.orElseThrow();
        UserDetail userDetail = UserDetail.builder()
            .id(userId)
            .nickname(user.getNickname())
            .profileUrl(user.getProfileUrl())
            .build();


        return new UserDetailAuthenticationToken(userDetail, authorities);
    }

    public UserDetail getUserDetailByRefreshToken(String refreshToken) {

        Claims claims = parseClaims(refreshToken);
        Long userId = Long.valueOf(claims.getSubject());

        Optional<User> optionalUser = userRepository.findById(userId);
        User user = optionalUser.orElseThrow();

        UserDetail userDetail = UserDetail.builder()
            .id(userId)
            .nickname(user.getNickname())
            .profileUrl(user.getProfileUrl())
            .build();
        return userDetail;
    }

    //인증 토큰에서 유저 ID 가져오는 기능
    public Long getUserIdFromToken(String token){
        Claims claims = parseClaims(token);
        return Long.valueOf(claims.getSubject());
    }
    //컨트롤러에서는 어떻게 사용할까?
//    public void 서비스 or 컨트롤러(HttpServletRequest request) {
//        String token = request.getHeader("Authorization").substring(7); // "Bearer " 접두사 제거
//        Long userId = tokenProvider.getUserIdFromToken(token);
//        // userId를 사용하는 로직...
//    }

}
