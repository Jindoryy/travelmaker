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

const cityDetail = (provinceId: number) => {
  return oauthInstance.get<CityResponse>(`city/${provinceId}`, {
    params: {
      provinceId: provinceId,
    },
  });
};

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

const destinationDistance = (destinationIdList: number[]) => {
  return oauthInstance.get<DestinationDistanceResponse>('destination/distance', {
    params: {
      destinationIdList: destinationIdList,
    },
  });
};
export { cityDetail, travelDetail, destinationDistance };
