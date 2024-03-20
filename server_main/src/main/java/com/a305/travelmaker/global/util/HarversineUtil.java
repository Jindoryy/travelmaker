package com.a305.travelmaker.global.util;

import com.a305.travelmaker.domain.travel.dto.Point;
import org.springframework.stereotype.Component;

@Component
public class HarversineUtil {

  public double calculateDistance(Point prevPoint, Point currentPoint) {
    double R = 6371; // 지구 반지름 (단위: km)
    double lat1 = Math.toRadians(prevPoint.getLatitude());
    double lon1 = Math.toRadians(prevPoint.getLongitude());
    double lat2 = Math.toRadians(currentPoint.getLatitude());
    double lon2 = Math.toRadians(currentPoint.getLongitude());

    double dLat = lat2 - lat1;
    double dLon = lon2 - lon1;

    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
