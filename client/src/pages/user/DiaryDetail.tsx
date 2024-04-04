import { useNavigate, useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { DiaryData, getDiary } from '../../utils/axios/axios-user';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const DiaryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { diaryId } = location.state || {};
  const [diaryData, setDiaryData] = useState<Partial<DiaryData>>({});
  const [imgUrls, setImgUrls] = useState<string[]>([]);

  useEffect(() => {
    getDiary(diaryId)
      .then((res) => {
        setDiaryData(res.data.data);
        setImgUrls(res.data.data.imgUrls);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleEditClick = () => {
    navigate('/diary/edit', { state: { diaryId } });
  };

  const handleListClick = () => {
    navigate('/mypage?tab=2');
  };

  return (
    <>
      <PageContainer>
        <TitleContainer>
          <TitleCity>{diaryData.name}</TitleCity>
          <TitleDate>
            {diaryData.startDate} ~ {diaryData.endDate}
          </TitleDate>
        </TitleContainer>
        <PhotoContainer>
          <SlideShow imgUrls={imgUrls} />
        </PhotoContainer>
        <ContentContainer>
          <div>{diaryData.text}</div>
        </ContentContainer>
        <ButtonBox>
          <ChooseButton onClick={handleEditClick}>수정</ChooseButton>
          <ChooseButtonBorder onClick={handleListClick}>목록</ChooseButtonBorder>
        </ButtonBox>
      </PageContainer>
    </>
  );
};

interface SlideShowProps {
  imgUrls: string[];
}

const SlideShow: React.FC<SlideShowProps> = ({ imgUrls }) => {
  // URL 배열을 기반으로 조건부 렌더링
  if (imgUrls.length === 1) {
    // URL이 하나만 있는 경우 단일 이미지 렌더링
    return <StyledImage src={imgUrls[0]} alt="Slide" />;
  } else {
    // 여러 URL이 있는 경우 슬라이더 컴포넌트 렌더링
    return (
      <Slider {...settings}>
        {imgUrls.map((imageUrl, index) => (
          <div key={index}>
            <StyledImage src={imageUrl} alt={`photo_${index}`} />
          </div>
        ))}
      </Slider>
    );
  }
};

const PageContainer = styled.div`
  width: 412px;
  min-height: 100%;
  background-color: #eff1fe;
  font-size: 1.2rem;
  padding-top: 15px;
`;
const TitleContainer = styled.div`
  background-color: white;
  margin: 0px 12px 20px;
  padding: 20px 30px;
  border-radius: 8px;
`;
const TitleCity = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;
const TitleDate = styled.div`
  font-size: 1.1rem;
  color: #555;
`;
const PhotoContainer = styled.div`
  background-color: white;
  margin: 0px 12px 20px;
  width: 347px;
  height: 200px;
  padding: 20px 20px 30px;
  border-radius: 8px;
`;
const ContentContainer = styled.div`
  background-color: white;
  margin: 0px 12px 10px;
  padding: 20px 30px;
  border-radius: 8px;
  min-height: 230px;
`;
const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ChooseButton = styled.button`
  width: 390px;
  height: 40px;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.subtext};
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;
const ChooseButtonBorder = styled.button`
  width: 390px;
  height: 40px;
  color: ${(props) => props.theme.main};
  background-color: ${(props) => props.theme.subtext};
  margin: 10px;
  padding: 10px;
  border: 1px solid;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
`;

const StyledImage = styled.img`
  width: 350px;
  height: 200px;
  object-fit: cover;
  object-position: center bottom;
`;
export default DiaryDetail;
