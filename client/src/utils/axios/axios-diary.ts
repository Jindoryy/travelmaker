import { AxiosResponse } from 'axios';
import { formDataInstance, oauthInstance, instance } from './axios-instance';

// DiaryPostData 인터페이스를 사용한 함수 매개변수 타입 정의
const postDiaryWithFiles = (data: FormData): Promise<AxiosResponse<any>> => {
    return formDataInstance.post('/diary', data);
};

export {postDiaryWithFiles}

interface DiaryAddRequest {
    travelId: number;
    text: string;
}
  
interface DiaryPostData {
    files: File[];
    diaryAddRequest: DiaryAddRequest;
}
  