package com.a305.travelmaker.domain.province.entity;

import com.a305.travelmaker.domain.city.entity.City;
import com.a305.travelmaker.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Province extends BaseEntity{

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "province_id")
  private Integer id;

  @OneToMany(mappedBy = "province")
  private List<City> cityList = new ArrayList<>();

  @Column(length = 20)
  private String name;

  @Column(name = "img_url", length = 500)
  private String imgUrl;

  @Builder
  public Province(String name, String imgUrl) {
    this.name = name;
    this.imgUrl = imgUrl;
  }
}
