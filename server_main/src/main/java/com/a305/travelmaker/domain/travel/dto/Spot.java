package com.a305.travelmaker.domain.travel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Spot {

  int v;
  double distance;

//  public int compareTo(Spot o) {
//    return Double.compare(this.distance, o.distance);
//  }
}
