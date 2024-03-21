package com.a305.travelmaker.domain.course.repository;

import com.a305.travelmaker.domain.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Integer> {

}
