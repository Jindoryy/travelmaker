package com.example.demo.data;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceDTO {
    private String contentid;
    private String contenttypeid;
    private String sigungucode;
    private String title;
    private String mapx;
    private String mapy;
    private String firstimage;

    public PlaceDTO() {
    }

    public PlaceDTO(String contentid, String contenttypeid, String sigungucode, String title, String mapx, String mapy, String firstimage) {
        this.contentid = contentid;
        this.contenttypeid = contenttypeid;
        this.sigungucode = sigungucode;
        this.title = title;
        this.mapx = mapx;
        this.mapy = mapy;
        this.firstimage = firstimage;
    }

    // Getters and Setters
}
