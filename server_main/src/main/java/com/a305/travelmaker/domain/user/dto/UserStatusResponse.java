// UserStatusResponse.java

package com.a305.travelmaker.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserStatusResponse {
    private String status;

    public UserStatusResponse(UserStatus status) {
        this.status = status.toString();
    }
}
