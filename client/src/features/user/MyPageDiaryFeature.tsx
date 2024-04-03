import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MyPageDiaryFeature: React.FC<MyPageDiaryFeatureProps> = ({ data }) => {
  const { diaryId, name, startDate, endDate, imgUrls } = data;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/diary/detail`, {
      state: {
        diaryId: diaryId,
      },
    });
  };

  return (
    <FeatureContainer onClick={handleClick}>
      <FeatureThumnail src={imgUrls}></FeatureThumnail>
      <FeatureTravelName>{name}</FeatureTravelName>
      <FeatureTravelDate>
        {startDate} ~ {endDate}
      </FeatureTravelDate>
    </FeatureContainer>
  );
};

export default MyPageDiaryFeature;

interface DiaryData {
  diaryId: number;
  name: string;
  startDate: string;
  endDate: string;
  imgUrls: string;
}

interface MyPageDiaryFeatureProps {
  data: DiaryData;
}

const FeatureContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  display: flex;
  width: 150px;
  height: 150px;
  color: white;
  text-align: center;
  border-radius: 10px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }
`;

const FeatureThumnail = styled.img`
  position: absolute;
  inset: 0;
  width: 150px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
  object-position: center;
`;

const FeatureTravelName = styled.div`
  margin-top: 80px;
  position: relative;
  align-self: center;
  z-index: 1;
  font:
    900 18px,
    sans-serif;
`;

const FeatureTravelDate = styled.div`
  position: relative;
  margin-top: 5px;
  z-index: 1;
  font:
    700 8px,
    sans-serif;
`;
