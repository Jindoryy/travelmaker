package com.a305.travelmaker.domain.memo.repository;

import com.a305.travelmaker.domain.memo.entity.Memo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoRepository extends JpaRepository<Memo, Integer> {

  Memo findByTravelId(Integer travelId);
}
