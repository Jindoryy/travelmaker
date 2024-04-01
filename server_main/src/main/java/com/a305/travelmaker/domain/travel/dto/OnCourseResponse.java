package com.a305.travelmaker.domain.travel.dto;

import com.a305.travelmaker.domain.course.dto.CourseInfo;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnCourseResponse {

  private String cityName;
  private LocalDate startDate;
  private List<CourseInfo> courseInfoList;
}
