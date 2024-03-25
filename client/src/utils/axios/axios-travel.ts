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

interface DestinationResponse {
  status: string;
  data: {
    destinationRecommendList: {
      sights: number[];
      cafe: number[];
      food: number[];
    };
  };
}

interface TravelResponse {
  status: string;
  data: {
    travelList: {
      1: [
        {
          point: {
            destinationId: number;
            latitude: number;
            longitude: number;
          };
          nextDestinationDistance: number;
        },
      ];
      2: [
        {
          point: {
            destinationId: number;
            latitude: number;
            longitude: number;
          };
          nextDestinationDistance: number;
        },
      ];
      3: [
        {
          point: {
            destinationId: number;
            latitude: number;
            longitude: number;
          };
          nextDestinationDistance: number;
        },
      ];
    };
  };
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

//시티 리스트 가져오기
const cityDetail = (provinceId: number) => {
  return oauthInstance.get<CityResponse>(`city/${provinceId}`, {
    params: {
      provinceId: provinceId,
    },
  });
};

//여행 저장하기
const travelDetail = (
  startDate: string,
  endDate: string,
  friendTag: number,
  transportation: string,
  destinationIdList: number[],
): Promise<AxiosResponse<TravelResponse>> => {
  return instance.post<TravelResponse>('travel', {
    startDate,
    endDate,
    friendTag,
    transportation,
    destinationIdList,
  });
};

const destinationDetail = (cityId: number) => {
  return oauthInstance.get<DestinationResponse>('destination/recommend', {
    params: {
      cityId: cityId,
    },
  });
};

const destinationDetail = (cityId: number) => {
  return oauthInstance.get<DestinationResponse>('destination/recommend', {
    params: {
      cityId: cityId,
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
