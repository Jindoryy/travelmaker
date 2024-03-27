import { AxiosResponse } from 'axios';
import { oauthInstance, instance } from './axios-instance';

interface CityResponse {
  status: string;
  data: [
    {
      cityId: number;
      cityName: string;
      cityUrl: string;
    },
  ];
}

//추천 장소 경도, 위도, 아이디, 다음 장소까지의 거리 받아오기
interface TravelResponse {
  status: string;
  data: {
    travelList: [
      [
        {
          point: {
            destinationId: number;
            latitude: number;
            longitude: number;
          };
          nextDestinationDistance: number;
        },
      ],
      [
        {
          point: {
            destinationId: number;
            latitude: number;
            longitude: number;
          };
          nextDestinationDistance: number;
        },
      ],
      [
        {
          point: {
            destinationId: number;
            latitude: number;
            longitude: number;
          };
          nextDestinationDistance: number;
        },
      ],
    ];
  };
}

//추천 장소 디테일 받아오기
interface DestinationDetailResponse {
  status: string;
  data: [
    {
      destinationId: number;
      destinationType: string;
      destinationName: string;
      destinationImgUrl: string;
    },
  ];
}

//코스 편집시 거리 가져오기
interface DestinationDistanceResponse {
  status: string;
  data: [
    {
      point: {
        destinationId: number;
        latitude: number;
        longitude: number;
      };
      nextDestinationDistance: number;
    },
  ];
}

//여행 저장시 필요한 여행 타입
interface TravelInfoType {
  startDate: string;
  endDate: string;
  friendTag: number[];
  transportation: string;
  destinationIdList: number[];
}

//시티 리스트 가져오기
const cityDetail = (provinceId: number) => {
  return oauthInstance.get<CityResponse>(`city/${provinceId}`, {
    params: {
      provinceId: provinceId,
    },
  });
};

//여행 저장하기 버튼 누르면 장소들 정보 받아와짐
const travelDetail = (travelInfo: TravelInfoType): Promise<AxiosResponse<TravelResponse>> => {
  return oauthInstance.post<TravelResponse>('travel', travelInfo);
};

//추천할 코스 장소 id들 넣어서 정보 가져오기
const destinationDetail = (destinationIdList: number[] | undefined) => {
  if (!destinationIdList) {
    console.error('Error: destinationIdList is undefined');
    return;
  }
  const queryString: string = destinationIdList.join(',');
  return oauthInstance.get<DestinationDetailResponse>('/destination', {
    params: {
      destinationsIdList: queryString,
    },
  });
};

// 코스 편집시 거리 가져오기
const destinationDistance = (destinationIdList: number[]) => {
  return oauthInstance.get<DestinationDistanceResponse>('destination/distance', {
    params: {
      destinationIdList: destinationIdList,
    },
  });
};
export { cityDetail, travelDetail, destinationDetail, destinationDistance };
