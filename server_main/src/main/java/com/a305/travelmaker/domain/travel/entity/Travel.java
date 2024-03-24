package com.a305.travelmaker.domain.travel.entity;

import com.a305.travelmaker.domain.course.entity.Course;
import com.a305.travelmaker.domain.memo.entity.Memo;
import com.a305.travelmaker.domain.travel.dto.DiaryStatus;
import com.a305.travelmaker.domain.travel.dto.Transportation;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.global.common.BaseEntity;
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
public class Travel extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "travel_id")
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  @OneToMany(mappedBy = "travel")
  private List<Course> courseList = new ArrayList<>();

  @OneToMany(mappedBy = "travel")
  private List<Memo> memoList = new ArrayList<>();

  @Enumerated(value = EnumType.STRING)
  private Transportation transportation;

  @Column(name = "city_name", length = 50)
  private String cityName;

  @Column(name = "start_date")
  private LocalDate startDate;

  @Column(name = "end_date")
  private LocalDate endDate;

  @Column(length = 1000)
  private String friends;

  @Enumerated(EnumType.STRING)
  private DiaryStatus status = DiaryStatus.BEFORE_DIARY;
}
