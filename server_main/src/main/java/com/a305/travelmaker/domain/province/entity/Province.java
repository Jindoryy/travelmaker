package com.a305.travelmaker.domain.province.entity;

import com.a305.travelmaker.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Province extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "province_id")
  private Integer id;

//  @OneToMany(mappedBy =  "Province")
//  private List<City> citys = new ArrayList<>();

  @Column(length = 20)
  private String name;

  @Column(length = 500)
  private String imgUrl;

  @Builder
  public Province(String name, String imgUrl) {
    this.name = name;
    this.imgUrl = imgUrl;
  }
}
