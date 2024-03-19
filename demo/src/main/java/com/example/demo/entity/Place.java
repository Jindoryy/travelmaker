package com.example.demo.entity;

import com.example.demo.service.FeatureMapper;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Place {
    @Id
    @Column(name = "destination_id")
    private String contentid;
    @Column(name = "CONTENT_TYPE_ID")
    private String contenttypeid;
    @Column(name = "city_id")
    private String sigungucode;
    @Column(name = "name")
    private String title;
    @Column(name = "latitude")
    private String mapx;
    @Column(name = "longitude")
    private String mapy;
    @Column(name = "img_url")
    private String firstimage;
    private String type;
    private String feature;
    @Column(name = "province_id")
    private String areacode;

    // transient로 설정하여 데이터베이스에 저장하지 않음

    private String content;

    // 생성자, 게터 및 세터 생략


    public Place() {
    }

    public Place(String contentid, String contenttypeid, String sigungucode, String title,
        String mapx, String mapy, String firstimage, String type, String cat1, String cat2,
        String cat3, String areacode, String content) { // 변경된 부분
        this.contentid = contentid;
        this.contenttypeid = contenttypeid;
        this.sigungucode = sigungucode;
        this.title = title;
        this.mapx = mapx;
        this.mapy = mapy;
        this.firstimage = firstimage;
        this.type = type;
        this.content = content;

        List<String> featureList = new ArrayList<>();
        if(cat3.equals("A05020900")){
            if (cat3 != null) {
                featureList.add(FeatureMapper.mapCodeToName(cat3));
            }
        }
        else {
            if (cat1 != null) {
                featureList.add(FeatureMapper.mapCodeToName(cat1));
            }
            if (cat2 != null) {
                featureList.add(FeatureMapper.mapCodeToName(cat2));
            }
            if (cat3 != null) {
                featureList.add(FeatureMapper.mapCodeToName(cat3));
            }
        }

        if (!featureList.isEmpty()) {
            this.feature = String.join(",", featureList);
        } else {
            this.feature = "";
        }

        this.areacode = areacode; // 추가된 부분
    }
}