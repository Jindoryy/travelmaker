package com.a305.travelmaker.domain.province.repository;

import com.a305.travelmaker.domain.province.entity.Province;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProvinceRepository extends JpaRepository<Province, Integer> {

  @Query("SELECT l.destinationId.city.province " +
      "FROM Likes l " +
      "GROUP BY l.destinationId.city.province " +
      "ORDER BY COUNT(l) DESC")
  List<Province> findTopFiveLikedProvinces();

}
