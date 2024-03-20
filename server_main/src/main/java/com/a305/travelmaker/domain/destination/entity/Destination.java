package com.a305.travelmaker.domain.destination.entity;

import com.a305.travelmaker.domain.city.entity.City;
import com.a305.travelmaker.domain.course.entity.Course;
import com.a305.travelmaker.domain.destination.dto.DestinationType;
import com.a305.travelmaker.domain.memo.entity.Memo;
import com.a305.travelmaker.domain.travel.dto.DiaryStatus;
import com.a305.travelmaker.domain.travel.dto.Transportation;
import com.a305.travelmaker.domain.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
}
