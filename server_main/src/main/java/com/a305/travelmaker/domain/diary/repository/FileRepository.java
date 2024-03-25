package com.a305.travelmaker.domain.diary.repository;

import com.a305.travelmaker.domain.diary.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Integer> {

}
