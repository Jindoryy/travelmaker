import styled from 'styled-components';
import ScheduleStatusButton from './ScheduleStatusButton ';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteDiary } from '../../utils/axios/axios-user';
import Swal from 'sweetalert2';

const MyPageScheduleFeature: React.FC<MyPageScheduleFeatureProps> = ({ data }) => {
  const { travelId, cityName, startDate, endDate, friendNameList, imgUrl, status, diaryId } = data;

  const friends = friendNameList.join(', ');
  // 현재 날짜를 확인합니다.
  const currentDate = new Date();
  const endDateObj = new Date(endDate);

  let buttonStatus: '코스보기' | '일기작성' | '일기보기' = '코스보기';

  // 조건에 따라 buttonStatus 값을 업데이트합니다.
  if (currentDate >= endDateObj) {
    if (status === 'BEFORE_DIARY') {
      buttonStatus = '일기작성';
    } else if (status === 'AFTER_DIARY') {
      buttonStatus = '일기보기';
    }
  }

  const handleDeleteClick = () => {
    // 사용자에게 삭제를 진행할지 확인합니다.
    Swal.fire({
      title: '정말로 삭제하시겠습니까?',
      text: '삭제한 후에는 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '예, 삭제하겠습니다!',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        // 사용자가 '예'를 클릭한 경우, 삭제 요청을 진행합니다.
        deleteDiary(travelId)
          .then(() => {
            Swal.fire('삭제되었습니다!', '해당 항목이 성공적으로 삭제되었습니다.', 'success').then(
              () => {
                // 삭제 성공 후 페이지 새로고침
                window.location.reload();
              },
            );
          })
          .catch(() => {
            // 삭제 요청 실패 시
            Swal.fire('삭제 실패', '삭제에 실패했습니다. 나중에 다시 시도해주세요.', 'error');
          });
      }
    });
  };

  return (
    <FeatureContainer>
      <FeatureThumnail src={imgUrl}></FeatureThumnail>
      <TextContainer>
        <TopConatiner>
          <TextTravelName>{cityName}</TextTravelName>
          <DeleteForeverIcon onClick={handleDeleteClick} style={{ cursor: 'pointer' }} />
        </TopConatiner>
        <TextDate>
          {startDate} ~ {endDate}
        </TextDate>
        <TextFreind>{friends}</TextFreind>
        <ButtonPlace>
          <ScheduleStatusButton
            data={{ travelId: travelId, status: buttonStatus, diaryId: diaryId }}
          />
        </ButtonPlace>
      </TextContainer>
    </FeatureContainer>
  );
};

export default MyPageScheduleFeature;

interface SchedulerData {
  travelId: number;
  cityName: string;
  startDate: string;
  endDate: string;
  friendNameList: string[];
  imgUrl: string;
  status: 'BEFORE_DIARY' | 'AFTER_DIARY';
  diaryId: number;
}

interface MyPageScheduleFeatureProps {
  data: SchedulerData;
}

const FeatureContainer = styled.div`
  width: 100%;
  height: 130px;
  background-color: #fefdd5;
  margin-top: 10px;
  display: flex;
  align-items: center;
  user-select: none;
  justify-content: space-between;
  border-radius: 15px;
  box-shadow: 0.5px 1px 1px gray;
`;

const FeatureThumnail = styled.img`
  width: 30%;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  object-position: center bottom;
  margin-left: 20px;
`;

const TextContainer = styled.div`
  display: relative;
  width: 70%;
  height: 100px;
`;

const TopConatiner = styled.div`
  display: relative;
  width: 90%;
  height: 25px;
  line-height: 25px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  padding: 0px 10px;
`;
const TextTravelName = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const TextDate = styled.div`
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 5px;
  margin-left: 10px;
`;

const TextFreind = styled.div`
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
  height: 14px;
  margin-left: 10px;
`;

const ButtonPlace = styled.div`
  width: 170px;
  display: flex;
  justify-content: flex-end;
`;
