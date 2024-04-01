import { useNavigate, useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { DiaryData, getDiary } from '../../utils/axios/axios-user';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const DiaryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);
  const { diaryId } = location.state || {};
  const [diaryData, setDiaryData] = useState<Partial<DiaryData>>({});
  const [imgUrls, setImgUrls] = useState<string[]>([]);

  useEffect(() => {
    getDiary(diaryId)
      .then((res) => {
        setDiaryData(res.data.data);
        console.log(res.data.data.imgUrls);
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

  const imageUrls = [
    'https://a.cdn-hotels.com/gdcs/production167/d236/59edd556-2e3f-4fa8-a97d-32efc0c18c6d.jpg?impolicy=fcrop&w=800&h=533&q=medium',
    'https://www.noblesse.com/shop/data/m/editor_new/2021/06/25/a2408f2530eb39c321.jpg',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
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
          <Slider {...settings}>
            {imgUrls.map((imageUrl, index) => (
              <StyledImage key={index} src={imageUrl} alt={`photo_${index}`} />
            ))}
          </Slider>
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
  font-family: 'Pretendard', sans-serif;
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
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
`;

const StyledImage = styled.img`
  width: 320px;
  height: 200px;
  object-fit: cover;
  object-position: center bottom;
`;
export default DiaryDetail;
