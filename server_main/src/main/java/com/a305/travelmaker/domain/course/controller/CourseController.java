package com.a305.travelmaker.domain.course.controller;

import com.a305.travelmaker.domain.course.service.CourseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/course")
@Tag(name = "Course", description = "코스 API")
public class CourseController {

  private final CourseService courseService;
}
