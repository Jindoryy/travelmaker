package com.a305.travelmaker.domain.diary.service;

import com.a305.travelmaker.domain.diary.dto.DiaryAddRequest;
import com.a305.travelmaker.domain.diary.dto.DiaryDetailResponse;
import com.a305.travelmaker.domain.diary.dto.DiaryUpdateRequest;
import com.a305.travelmaker.domain.diary.entity.Diary;
import com.a305.travelmaker.domain.diary.entity.File;
import com.a305.travelmaker.domain.diary.repository.DiaryRepository;
import com.a305.travelmaker.domain.diary.repository.FileRepository;
import com.a305.travelmaker.domain.travel.entity.Travel;
import com.a305.travelmaker.domain.travel.repository.TravelRepository;
import com.a305.travelmaker.global.util.FileUtil;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class DiaryService {

  private final FileUtil fileUtil;
  private DiaryRepository diaryRepository;
  private TravelRepository travelRepository;
  private FileRepository fileRepository;

  public DiaryDetailResponse findDiaryDetail(Integer id) {

    Diary diary = diaryRepository.findById(id).get();
    Travel travel = travelRepository.findById(diary.getTravel().getId()).get();

    return DiaryDetailResponse.builder()
        .name(travel.getCityName())
        .startDate(travel.getStartDate())
        .endDate(travel.getEndDate())
        .text(diary.getText())
        .imgUrls(diary.getFileList().stream().map(File::getImgUrl).collect(Collectors.toList()))
        .build();
  }

//  public List<DiaryListResponse> findDiaryList() {
//
//    return diaryRepository.findAll();
//  }

  @Transactional
  public void saveDiary(List<MultipartFile> files, DiaryAddRequest diaryAddRequest) {

    // travelId로 여행 정보를 불러온 다음, 관련 엔티티(User, Travel)랑 같이 저장, 그리고 파일 저장
    Travel travel = travelRepository.findById(diaryAddRequest.getTravelId()).get();

    Diary diary = diaryRepository.save(
        Diary.builder()
            .user(null)
            .travel(travel)
            .text(diaryAddRequest.getText())
            .build()
    );

    for (MultipartFile file : files) {

      String imgUrl = fileUtil.uploadFile(file);
      fileRepository.save(
          File.builder()
              .diary(diary)
              .imgUrl(imgUrl)
              .build()
      );
    }
  }

  public void ModifyDiary(DiaryUpdateRequest diaryUpdateRequest) {

    Diary diary = diaryRepository.findById(diaryUpdateRequest.getDiaryId()).get();

    diary.setText(diaryUpdateRequest.getText());

    diaryRepository.save(diary);
  }
}
