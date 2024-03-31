package com.a305.travelmaker.domain.destination.entity;

import com.a305.travelmaker.domain.city.entity.City;
import com.a305.travelmaker.domain.destination.dto.DestinationType;
import com.a305.travelmaker.domain.likes.entity.Likes;
import com.a305.travelmaker.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class Destination {

  @Id
  @Column(name = "destination_id")
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "city_id")
  private City city;

  @Column(length = 1000)
  private String name;

  @Enumerated(value = EnumType.STRING)
  private DestinationType type;

  @Column(length = 1000)
  private String content;

  @Column(length = 1000)
  private String feature;

  private double latitude;

  private double longitude;

  @Column(name = "img_url", length = 500)
  private String imgUrl;

  @Column(name = "content_type_id")
  private int contentTypeId;

  //영진 추가 (join은 안했음. 주석은 나중에 삭제)
  @Column(name = "province_id")
  private int provinceId;
}
