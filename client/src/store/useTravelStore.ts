import { create } from 'zustand';

//최적경로 보기 위한 TravelInfo
interface TravelInfoType {
  startDate: string;
  endDate: string;
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

//도, 시 저장하기 위한 TravelCity
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

//최종 여행 저장 위한 Type
interface TravelType {
  cityName: string;
  startDate: string;
  endDate: string;
  friendIdList: number[];
  transportation: string;
  courseList: number[];
}
interface TravelState {
  travel: TravelType;
}

interface TravelActions {
  setTravel: (travel: TravelType) => void;
  deleteTravel: () => void;
}

//도, 시 저장 위한 변수
const defaultCityState = {
  cityId: 212,
  city: '강릉시',
  provinceId: 32,
  province: '강원도',
};

const useTravelCity = create<TravelCityState & TravelCityActions>((set) => ({
  travelCity: defaultCityState,
  setTravelCity: (travelCity: TravelCityType) => {
    set({ travelCity });
  },
}));

//최적 경로 위한 변수
const defaultCourseState = {
  startDate: '2024-03-20',
  endDate: '2024-03-22',
  transportation: 'CAR',
  destinationIdList: [125417, 125617, 125636, 133494, 132775],
};

const useTravelInfo = create<TravelInfoState & TravelInfoActions>((set) => ({
  travelInfo: defaultCourseState,
  setTravelInfo: (travelInfo: TravelInfoType) => {
    set({ travelInfo });
  },
  deleteTravelInfo: () => {
    set({ travelInfo: defaultCourseState });
  },
}));

//최종 여행 저장 변수
const defaultTravelState = {
  cityName: '',
  startDate: '',
  endDate: '',
  friendIdList: [],
  transportation: '',
  courseList: [],
};

const useTravelSave = create<TravelState & TravelActions>((set) => ({
  travel: defaultTravelState,
  setTravel: (travel: TravelType) => {
    set({ travel });
  },
  deleteTravel: () => {
    set({ travel: defaultTravelState });
  },
}));
export { useTravelInfo, useTravelCity, useTravelSave };
