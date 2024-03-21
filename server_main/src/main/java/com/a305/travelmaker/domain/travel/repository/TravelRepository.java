package com.a305.travelmaker.domain.travel.repository;

import com.a305.travelmaker.domain.travel.entity.Travel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelRepository extends JpaRepository<Travel, Integer> {

}
