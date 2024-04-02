// TravelRepository.java

package com.a305.travelmaker.domain.travel.repository;

import com.a305.travelmaker.domain.travel.dto.DiaryStatus;
import com.a305.travelmaker.domain.travel.entity.Travel;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TravelRepository extends JpaRepository<Travel, Integer> {

  List<Travel> findByUserId(Long userId);
  long countByUserIdAndStatusAndStartDateBetween(Long userId, DiaryStatus status, LocalDate start, LocalDate end);
  List<Travel> findByUserIdAndStatusAndStartDateBetween(Long userId, DiaryStatus status, LocalDate start, LocalDate end);

  @Query("SELECT t FROM Travel t WHERE t.user.id = :userId AND t.startDate >= :today ORDER BY ABS(DATEDIFF(t.startDate, :today)) ASC")
  Travel findNextTravelByUserId(Long userId, LocalDate today);

  @Query("SELECT t FROM Travel t WHERE t.user.id = :userId AND :today BETWEEN t.startDate AND t.endDate")
  Travel findSingleTravelByUserIdAndTodayBetweenStartDateAndEndDate(Long userId, LocalDate today);

  @Query("SELECT t FROM Travel t WHERE t.user.id = :userId AND t.endDate > :today")
  List<Travel> findTravelAfterToday(Long userId, LocalDate today);
}
