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

// 장소조회(장소선택 페이지)
interface DestinationArrayResponse {
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

//CF 장소 목록 (메인 페이지 - 코스전)
interface SiteListResponse {
  status: string;
  data: {
    destinationListResponseMap: {
      basic: [
        {
          destinationId: number;
          destinationType: string;
          destinationContent: string;
          destinationName: string;
          destinationImgUrl: string;
        },
      ];
      popular: [
        {
          destinationId: number;
          destinationType: string;
          destinationContent: string;
          destinationName: string;
          destinationImgUrl: string;
        },
      ];
    };
  };
}

//장소 좋아요
interface LikeResponse {
  status: string;
  data: string;
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

//CF 장소 목록 (메인 페이지 - 코스전)
const siteListDetail = () => {
  return oauthInstance.get<SiteListResponse>('destination/list', {});
};

// 장소조회(장소선택 페이지)
const destinationArray = (destinationsIdList: number[]) => {
  return oauthInstance.get<DestinationArrayResponse>('destination', {
    params: {
      destinationsIdList: destinationsIdList.join(','), // 배열을 문자열로 변환하여 전달
    },
  });
};

//장소 좋아요
const likeDestination = (
  userId: number,
  destinationId: number,
): Promise<AxiosResponse<LikeResponse>> => {
  return instance.post<LikeResponse>('like', {
    userId,
    destinationId,
  });
};

// 코스 편집시 거리 가져오기
const destinationDistance = (destinationsIdList: number[]) => {
  return oauthInstance.get<DestinationDistanceResponse>('destination/distance', {
    params: {
      destinationsIdList: destinationsIdList,
    },
  });
};
export {
  cityDetail,
  travelDetail,
  destinationDetail,
  siteListDetail,
  destinationDistance,
  likeDestination,
  destinationArray,
};
