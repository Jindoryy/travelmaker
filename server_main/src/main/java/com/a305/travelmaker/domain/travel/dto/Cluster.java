package com.a305.travelmaker.domain.travel.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cluster {

  private Point centroid; // 기준점
  private List<Point> points;

  public Cluster(Point centroid) {
    this.centroid = centroid;
    this.points = new ArrayList<>();
  }

  public void addPoint(Point point) {
    points.add(point);
  }

  public void clearPoints() {
    points.clear();
  }

  public Point calculateCentroid() { // 기준점 재할당
    double totalLatitude = 0;
    double totalLongitude = 0;
    for (Point point : points) {
      totalLatitude += point.getLatitude();
      totalLongitude += point.getLongitude();
    }
    double meanLatitude = totalLatitude / points.size();
    double meanLongitude = totalLongitude / points.size();
    return new Point(meanLatitude, meanLongitude);
  }
}
