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

const defaultState = {
  startDate: '2024-03-25',
  endDate: '2024-03-27',
  friendTag: [1, 2, 3],
  transportation: 'WALK',
  destinationIdList: [1000981, 1003205, 1004281, 1005548, 1005620, 1007868, 1008362],
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

export default useTravelInfo;
