package com.a305.travelmaker.domain.diary.service;

import com.a305.travelmaker.domain.diary.dto.DiaryAddRequest;
import com.a305.travelmaker.domain.diary.dto.DiaryDetailResponse;
import com.a305.travelmaker.domain.diary.dto.DiaryListResponse;
import com.a305.travelmaker.domain.diary.dto.DiaryUpdateRequest;
import com.a305.travelmaker.domain.diary.entity.Diary;
import com.a305.travelmaker.domain.diary.entity.File;
import com.a305.travelmaker.domain.diary.repository.DiaryRepository;
import com.a305.travelmaker.domain.diary.repository.FileRepository;
import com.a305.travelmaker.domain.travel.dto.DiaryStatus;
import com.a305.travelmaker.domain.travel.entity.Travel;
import com.a305.travelmaker.domain.travel.repository.TravelRepository;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.domain.user.repository.UserRepository;
import com.a305.travelmaker.global.util.FileUtil;
import java.util.ArrayList;
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
  private final DiaryRepository diaryRepository;
  private final TravelRepository travelRepository;
  private final FileRepository fileRepository;
  private final UserRepository userRepository;

  public DiaryDetailResponse findDiaryDetail(Integer id) {

    Diary diary = diaryRepository.findById(id).get();

    return DiaryDetailResponse.builder()
        .name(diary.getTravel().getCityName())
        .startDate(diary.getTravel().getStartDate())
        .endDate(diary.getTravel().getEndDate())
        .text(diary.getText())
        .imgUrls(diary.getFileList().stream().map(File::getImgUrl).collect(Collectors.toList()))
        .build();
  }

  public List<DiaryListResponse> findDiaryList(Long userId) {

    List<DiaryListResponse> diaryListResponses = new ArrayList<>();
    List<Diary> diaryList = diaryRepository.findByUserId(userId);

    for (Diary diary : diaryList) {

      diaryListResponses.add(DiaryListResponse.builder()
          .diaryId(diary.getId())
          .name(diary.getTravel().getCityName())
          .startDate(diary.getTravel().getStartDate())
          .endDate(diary.getTravel().getEndDate())
          .imgUrls(diary.getFileList().get(0).getImgUrl())
          .build());
    }

    return diaryListResponses;
  }

  @Transactional
  public void saveDiary(Long userId, List<MultipartFile> files, DiaryAddRequest diaryAddRequest) {

    // travelId로 여행 정보를 불러온 다음, 관련 엔티티(User, Travel)랑 같이 저장, traveStatus변경(BEFORE_DIARY인지 AFTER_DIARY인지), 그리고 파일 저장
    Travel travel = travelRepository.findById(diaryAddRequest.getTravelId()).get();
    User user = userRepository.findById(userId).get();

    Diary diary = diaryRepository.save(
        Diary.builder()
            .user(user)
            .travel(travel)
            .text(diaryAddRequest.getText())
            .build()
    );

    travel.setStatus(DiaryStatus.AFTER_DIARY);
    travelRepository.save(travel);

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
