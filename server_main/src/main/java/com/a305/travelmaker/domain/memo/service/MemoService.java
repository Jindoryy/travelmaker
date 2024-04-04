package com.a305.travelmaker.domain.memo.service;

import com.a305.travelmaker.domain.memo.dto.MemoRequest;
import com.a305.travelmaker.domain.memo.dto.MemoResponse;
import com.a305.travelmaker.domain.memo.entity.Memo;
import com.a305.travelmaker.domain.memo.repository.MemoRepository;
import com.a305.travelmaker.domain.travel.entity.Travel;
import com.a305.travelmaker.domain.travel.repository.TravelRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemoService {
    private final MemoRepository memoRepository;
    private final TravelRepository travelRepository;


    public MemoResponse createMemo(MemoRequest memoRequest) {
        Travel travel = travelRepository.findById(memoRequest.getTravelId())
            .orElseThrow(() -> new IllegalArgumentException("Travel not found"));
        Memo memo = Memo.builder()
            .travel(travel)
            .memo(memoRequest.getMemo())
            .build();
        Memo savedMemo = memoRepository.save(memo);

        MemoResponse memoResponse = new MemoResponse();
        memoResponse.setId(savedMemo.getId());
        memoResponse.setTravelId(savedMemo.getTravel().getId());
        memoResponse.setMemo(savedMemo.getMemo());

        return memoResponse;
    }



    public MemoResponse updateMemo(Integer memoId, MemoRequest memoRequest) {
        Memo memo = memoRepository.findById(memoId)
            .orElseThrow(() -> new IllegalArgumentException("Memo not found"));

        // Memo 엔티티를 직접 업데이트
        memo = Memo.builder()
            .id(memo.getId())
            .travel(memo.getTravel())
            .memo(memoRequest.getMemo())
            .build();

        Memo savedUpdatedMemo = memoRepository.save(memo);

        MemoResponse updatedMemoResponse = new MemoResponse();
        updatedMemoResponse.setId(savedUpdatedMemo.getId());
        updatedMemoResponse.setTravelId(savedUpdatedMemo.getTravel().getId());
        updatedMemoResponse.setMemo(savedUpdatedMemo.getMemo());

        return updatedMemoResponse;
    }






    public void deleteMemo(Integer memoId) {
        memoRepository.deleteById(memoId);
    }


    public List<MemoResponse> getAllMemosByTravelId(Integer travelId) {
        // 해당 travelId를 가진 여행을 찾습니다.
        Travel travel = travelRepository.findById(travelId)
            .orElseThrow(() -> new IllegalArgumentException("Travel not found"));

        // 해당 여행에 속하는 모든 메모를 조회합니다.
        List<Memo> memos = memoRepository.findByTravel(travel);

        // MemoResponse로 변환하여 리스트에 담습니다.
        List<MemoResponse> memoResponses = memos.stream()
            .map(memo -> {
                MemoResponse memoDto = new MemoResponse();
                memoDto.setId(memo.getId());
                memoDto.setTravelId(memo.getTravel().getId());
                memoDto.setMemo(memo.getMemo());
                return memoDto;
            })
            .collect(Collectors.toList());

        return memoResponses;
    }


}
