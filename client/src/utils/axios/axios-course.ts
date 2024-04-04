import { AxiosResponse } from "axios";
import { instance } from "./axios-instance";

interface Province {
    provinceId: number;
    provinceName: string;
    provinceUrl: string;
}

interface ProvinceResponse {
    status: string;
    data: Province[];
}

const getCourse = (): Promise<AxiosResponse<ProvinceResponse>> => {
    return instance.get<ProvinceResponse>('province/list');
}
const getRecommandCourse = (): Promise<AxiosResponse<ProvinceResponse>> => {
    return instance.get<ProvinceResponse>('province/recommend');
}

export { getCourse, getRecommandCourse };