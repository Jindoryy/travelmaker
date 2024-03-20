package com.a305.travelmaker.global.common.jwt;

public class JwtAccessDeniedHandler {

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        objectMapper.writeValue(response.getOutputStream(), FailResponse.of(ErrorCode.KAKAO_AUTHORIZATION_CODE_ERROR));
    }
}
