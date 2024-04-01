package com.a305.travelmaker.domain.city.repository;

import com.a305.travelmaker.domain.city.entity.City;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CityRepository extends JpaRepository<City, Integer> {

//  List<City> findByProvinceId(Integer id);

  City findByName(String cityName);

  @Query("SELECT l.destinationId.city " +
      "FROM Likes l " +
      "WHERE l.destinationId.city.province.id = :provinceId " +
      "GROUP BY l.destinationId.city " +
      "ORDER BY COUNT(l) DESC")
  List<City> findCitiesByProvinceIdOrderByLikes(Integer provinceId);

}
