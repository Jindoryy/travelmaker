import { create } from 'zustand';

interface TravelInfoType {
  startDate: string;
  endDate: string;
  friendTag: number[];
  transportation: string;
  destinationIdList: number[];
}

interface TravelInfoState {
  travelInfo: TravelInfoType;
}

interface TravelInfoActions {
  setTravelInfo: (travelInfo: TravelInfoType) => void;
  deleteTravelInfo: () => void;
}

interface TravelCityType {
  cityId: number;
  city: string;
  provinceId: number;
  province: string;
}

interface TravelCityState {
  travelCity: TravelCityType;
}

interface TravelCityActions {
  setTravelCity: (travelCity: TravelCityType) => void;
}

const defaultCityState = {
  cityId: 212,
  city: '강릉',
  provinceId: 32,
  province: '강원도',
};

const useTravelCity = create<TravelCityState & TravelCityActions>((set) => ({
  travelCity: defaultCityState,
  setTravelCity: (travelCity: TravelCityType) => {
    set({ travelCity });
  },
}));

const defaultState = {
  startDate: '2024-03-20',
  endDate: '2024-03-22',
  friendTag: [1, 2, 3],
  transportation: 'CAR',
  destinationIdList: [125417, 125617, 125636, 133494, 132775],
};

const useTravelInfo = create<TravelInfoState & TravelInfoActions>((set) => ({
  travelInfo: defaultState,
  setTravelInfo: (travelInfo: TravelInfoType) => {
    set({ travelInfo });
  },
  deleteTravelInfo: () => {
    set({ travelInfo: defaultState });
  },
}));

export { useTravelInfo, useTravelCity };
