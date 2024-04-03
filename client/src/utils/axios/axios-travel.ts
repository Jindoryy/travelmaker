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
      destinationContent: string;
      destinationName: string;
      destinationImgUrl: string;
      likes_flag: boolean;
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

//CF 장소 목록 (메인 페이지 - 비로그인)
interface NonLoginSiteListResponse {
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
          likes_flag: boolean;
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
    travelList: [
      [
        {
          point: {
            destinationId: number;
            latitude: number;
            longitude: number;
          };
          nextDestinationDistance: number;
          destinationName: string;
          destinationType: string;
          destinationImgUrl: string;
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
          destinationName: string;
          destinationType: string;
          destinationImgUrl: string;
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
          destinationName: string;
          destinationType: string;
          destinationImgUrl: string;
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
      destinationName: string;
      destinationType: string;
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
      destinationName: string;
      destinationType: string;
      destinationImgUrl: string;
    },
  ];
}

//여행 생성시 필요한 여행 타입(최적 경로 받기)
interface TravelInfoType {
  startDate: string;
  endDate: string;
  transportation: string;
  destinationIdList: number[];
}

//여행 최종 저장시 필요한 타입
interface TravelSaveType {
  cityName: string;
  startDate: string;
  endDate: string;
  friendIdList: number[];
  transportation: string;
  courseList: number[];
}

interface TravelSaveResponse {
  success: boolean;
}

//저장된 여행 조회하기
interface TravelDetailPoint {
  destinationId: number;
  latitude: number;
  longitude: number;
}
interface TravelDetailDestination {
  point: TravelDetailPoint;
  nextDestinationDistance: number;
  destinationName: string;
  destinationType: string;
  destinationImgUrl: string;
}
export interface TravelDetailData {
  cityName: string;
  startDate: string;
  endDate: string;
  transportation: string;
  travelList: TravelDetailDestination[][];
}
interface TravelDetailResponse {
  status: string;
  data: TravelDetailData;
}
//친구 검색하기
interface FriendFindType {
  userId: number;
  profileUrl: string;
  nickname: string;
  tag: number;
}

//여행 날짜 조회하기
interface DateDetail {
  startDate: string;
  endDate: string;
}
interface DateResponse {
  map: any;
  datedata: DateDetail[];
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
const destinationsListDetail = (destinationIdList: number[] | undefined) => {
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

//시 선택 완료 -> 친구리스트, cityid넘기기
const destinationDetail = (cityId: number, friendList: any) => {
  return oauthInstance.get<DestinationResponse>('destination/recommend', {
    params: {
      cityId: cityId,
      friendIdList: friendList.join(','),
    },
  });
};

//CF 장소 목록 (메인 페이지 - 코스전)
const siteListDetail = () => {
  return oauthInstance.get<SiteListResponse>('destination/list', {});
};

//CF 장소 목록 (메인 페이지 - 비로그인)
const nonLoginsiteList = () => {
  return instance.get<NonLoginSiteListResponse>('destination/list/non-login', {});
};

// 장소조회(장소선택 페이지)
const destinationArray = (destinationsIdList: number[] | undefined) => {
  if (!destinationsIdList) return Promise.reject('destinationsIdList is undefined');
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
  return oauthInstance.post<LikeResponse>('like', {
    userId: userId,
    destinationId: destinationId,
  });
};

// 코스 편집시 거리 가져오기
const destinationDistance = (destinationsIdList: number[]) => {
  return oauthInstance.get<DestinationDistanceResponse>('destination/distance', {
    params: {
      destinationsIdList: destinationsIdList.join(','),
    },
  });
};

//여행 최종 저장하기
const travelSave = (travelInfo: TravelSaveType) => {
  return oauthInstance.post<TravelSaveResponse>('travel/info', travelInfo);
};

//저장된 여행 조회하기
const getTravelDetail = (travelId: any) => {
  let numberOfTravel = Number(travelId.travelId);
  return oauthInstance.get<TravelDetailResponse>(`travel/${numberOfTravel}`);
};

const getTravelDetailDiary = (travelId: Number) => {
  return oauthInstance.get<TravelDetailResponse>(`travel/${travelId}`);
};

//친구 검색하기
const findFriend = (userInfo: string) => {
  return oauthInstance.get<FriendFindType>('/user/search', {
    params: {
      condition: userInfo,
    },
  });
};

//여행조회해서 달력에 표시해 줄 api 연결하기
const getAlreadyConfirm = (userId: number) => {
  return instance.get<DateResponse>('/user/afterToday', {
    params: {
      userId: userId,
    },
  });
};
export {
  cityDetail,
  travelDetail,
  destinationDetail,
  siteListDetail,
  likeDestination,
  destinationDistance,
  destinationArray,
  destinationsListDetail,
  travelSave,
  getTravelDetail,
  getTravelDetailDiary,
  TravelDetailResponse,
  findFriend,
  getAlreadyConfirm,
  nonLoginsiteList,
};
