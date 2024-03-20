package com.a305.travelmaker.global.common.jwt;

public class JwtAuthenticationEntryPoint {

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
        AuthenticationException authException) throws IOException, ServletException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        objectMapper.writeValue(response.getOutputStream(), FailResponse.of(
            ErrorCode.UNAUTHORIZED_USER_ERROR));
    }
}
