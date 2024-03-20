package com.a305.travelmaker.domain.destination.repository;

import com.a305.travelmaker.domain.destination.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository extends JpaRepository<Destination, Integer> {

}
