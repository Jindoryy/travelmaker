package com.a305.travelmaker.domain.memo.repository;

import com.a305.travelmaker.domain.memo.entity.Memo;
import com.a305.travelmaker.domain.travel.entity.Travel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoRepository extends JpaRepository<Memo, Integer> {

  Memo findByTravelId(Integer travelId);

  List<Memo> findByTravel(Travel travel);


}
