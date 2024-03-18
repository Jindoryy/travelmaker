package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String contentid;
    private String contenttypeid;
    private String sigungucode;
    private String title;
    private String mapx;
    private String mapy;
    private String firstimage;
    private String type;
    private String cat1;

    public Place() {
    }

    public Place(String contentid, String contenttypeid, String sigungucode, String title, String mapx, String mapy, String firstimage, String type) {
        this.contentid = contentid;
        this.contenttypeid = contenttypeid;
        this.sigungucode = sigungucode;
        this.title = title;
        this.mapx = mapx;
        this.mapy = mapy;
        this.firstimage = firstimage;
        this.type = type;
 }

    // Getters and Setters
}
