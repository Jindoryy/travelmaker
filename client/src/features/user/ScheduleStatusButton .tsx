import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ScheduleStatusButton: React.FC<StatusProps> = ({ data }) => {
  const { travelId, status, diaryId } = data;
  const navigate = useNavigate();

  const handleClick = () => {
    switch (status) {
      case '코스보기':
        navigate(`/course/detail/${travelId}`, {
          state: {
            travelId: travelId,
          },
        });
        break;
      case '일기작성':
        navigate(`/diary/write`, {
          state: {
            travelId: travelId,
          },
        });
        break;
      case '일기보기':
        navigate(`/diary/detail`, {
          state: {
            diaryId: diaryId,
          },
        });
        break;
      default:
        console.error('상태값 props 에러, 체크 필요');
    }
  };

  return (
    <Button onClick={handleClick} status={status}>
      {status}
    </Button>
  );
};

export default ScheduleStatusButton;

interface StatusData {
  travelId: number;
  status: '코스보기' | '일기작성' | '일기보기';
  diaryId: number;
}
interface StatusProps {
  data: StatusData;
}

interface ButtonProps {
  status: '코스보기' | '일기작성' | '일기보기';
}

const Button = styled.div<ButtonProps>`
  width: 80px;
  height: 30px;
  border-radius: 15px;
  color: white;
  background-color: ${({ status }) => {
    switch (status) {
      case '코스보기':
        return '#FFE198';
      case '일기작성':
        return '#FFC6A4';
      case '일기보기':
        return '#FF65A3';
      default:
        return 'transparent';
    }
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
`;
