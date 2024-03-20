package com.a305.travelmaker.domain.login.dto;

import java.util.Collection;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class UserDetailAuthenticationToken extends AbstractAuthenticationToken {

    private final UserDetail userDetail;

    public UserDetailAuthenticationToken(UserDetail details, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.userDetail = details;
        super.setAuthenticated(true);
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return super.getAuthorities();
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public UserDetail getDetails() {
        return userDetail;
    }
    @Override
    public Object getPrincipal() {
        return userDetail;
    }

    @Override
    public boolean isAuthenticated() {
        return super.isAuthenticated();
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        super.setAuthenticated(isAuthenticated);
    }

    @Override
    public String getName() {
        return userDetail.getNickname();
    }

}
