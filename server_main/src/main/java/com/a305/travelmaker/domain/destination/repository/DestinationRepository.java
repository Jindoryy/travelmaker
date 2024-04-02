package com.a305.travelmaker.domain.destination.repository;

import com.a305.travelmaker.domain.destination.entity.Destination;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DestinationRepository extends JpaRepository<Destination, Integer> {

  @Query(value = "SELECT d FROM Destination d ORDER BY d.id ASC LIMIT 30")
  List<Destination> findRandom30Destinations();
}
