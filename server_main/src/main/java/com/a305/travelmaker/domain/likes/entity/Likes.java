package com.a305.travelmaker.domain.likes.entity;

import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "LIKES")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Likes extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "destination_id")
    private Destination destinationId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User userId;

    @Setter
    @Column(nullable = false)
    private Boolean flag;

    @Builder
    public Likes(Destination destinationId, User userId, Boolean flag) {
        this.destinationId = destinationId;
        this.userId = userId;
        this.flag = flag;
    }
}
