package com.a305.travelmaker.global.config;

import com.a305.travelmaker.global.common.jwt.JwtAccessDeniedHandler;
import com.a305.travelmaker.global.common.jwt.JwtAuthenticationEntryPoint;
import com.a305.travelmaker.global.common.jwt.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.exceptionHandling(authEntryPoint -> authEntryPoint
            .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .accessDeniedHandler(jwtAccessDeniedHandler));
        http.sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
            http.authorizeHttpRequests(request -> request
                .requestMatchers(
                    "/**"
//                        "/login/oauth2/code/kakao",
//                        "/login/oauth/token",
//                        "/swagger-ui/**",
//                        "api-docs/**",
//                        "/city/**",
//                        "/province/**",
//                        "/travel/**",
//                        "/destination/**",
//                        "/like/**"
                )
                .permitAll());
        http.logout((logout) -> logout
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            .logoutSuccessUrl("/")
            .invalidateHttpSession(true));
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
