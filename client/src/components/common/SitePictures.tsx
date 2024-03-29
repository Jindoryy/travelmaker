import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { siteListDetail, likeDestination } from '../../utils/axios/axios-travel';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserInfo from '../../store/useUserStore';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
// import MasonryItem from '@mui/lab/MasonryItem'; // MasonryItem 추가
//좋아요 체크박스
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';

interface SiteListProps {
  status: string;
  data: {
    destinationListResponseMap: {
      basic: [
        {
          destinationId: number;
          destinationType: string;
          destinationContent: string;
          destinationName: string;
          destinationImgUrl: string;
        },
      ];
      popular: [
        {
          destinationId: number;
          destinationType: string;
          destinationContent: string;
          destinationName: string;
          destinationImgUrl: string;
        },
      ];
    };
  };
}

const SitePictures = () => {
  const [siteInfoList, setSiteInfoList] = useState<SiteListProps>({
    status: '',
    data: {
      destinationListResponseMap: {
        basic: [
          {
            destinationId: 0,
            destinationType: '',
            destinationContent: '',
            destinationName: '',
            destinationImgUrl: '',
          },
        ],
        popular: [
          {
            destinationId: 0,
            destinationType: '',
            destinationContent: '',
            destinationName: '',
            destinationImgUrl: '',
          },
        ],
      },
    },
  });

  const [flippedIndex, setFlippedIndex] = useState<number | null>(null); // 이미지가 뒤집힌 인덱스를 관리
  const [imageHeights, setImageHeights] = useState<number[]>([]); // 이미지의 높이를 상태로 관리
  const location = useLocation();
  // const { userInfo } = useUserInfo(); // useUserInfo 스토어에서 userInfo 가져오기
  // const userId = userInfo.userId; // userId 가져오기
  const userId = 126;
  useEffect(() => {
    // 컴포넌트가 마운트될 때 한 번만 실행
    getSiteInfoList();
  }, []); // useEffect 두번째 매개변수에 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행되도록 설정

  useEffect(() => {
    // basic 목적지 이미지의 수 만큼 랜덤한 높이를 생성하여 상태로 설정
    const heights = siteInfoList.data.destinationListResponseMap.basic.map(() => getRandomHeight());
    setImageHeights(heights);
  }, [siteInfoList]);

  const handleImageClick = (index: number) => {
    // 이미지 클릭 시 뒤집기
    setFlippedIndex(index === flippedIndex ? null : index);
  };

  const handleCheckboxChange =
    (destinationId: number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        try {
          // 좋아요 누른 경우 해당 destinationId를 likeDestination으로 전송
          const response = await likeDestination(userId, destinationId);
          // console.log(userId);
          // console.log('Liked destinationId:', destinationId);
          // console.log('Like response:', response.data);
        } catch (error) {
          console.error('Error occurred while liking destination:', error);
        }
      }
    };
  const getSiteInfoList = () => {
    siteListDetail()
      .then((response) => {
        // console.log(response.data);
        const siteListResponse: SiteListProps = {
          status: response.data.status,
          data: response.data.data,
        };
        setSiteInfoList(siteListResponse);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const getRandomHeight = () => {
    return Math.floor(Math.random() * 200) + 150; // 200부터 400까지의 랜덤한 값 생성
  };

  return (
    // <Box sx={{ width: 395 }}>
    <Masonry columns={2} spacing={1}>
      {/* basic에 있는 모든 목적지 이미지를 표시 */}
      {siteInfoList.data.destinationListResponseMap.basic.map((destination, index) => (
        <SiteItem key={index}>
          {/* 좋아요 체크박스 */}
          <StyledCheckbox
            {...label}
            sx={{
              color: pink[600],
              '&.Mui-checked': {
                color: pink[600],
              },
            }}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            onChange={handleCheckboxChange(destination.destinationId)}
          />
          <SiteImage
            style={{ height: `${imageHeights[index]}px` }}
            src={destination.destinationImgUrl}
            alt={destination.destinationName}
            onClick={() => handleImageClick(index)}
            isFlipped={index === flippedIndex}
          />

          {/* 뒷면 */}
          {index === flippedIndex && (
            <Back onClick={() => handleImageClick(index)}>
              <BackText>
                {destination.destinationName.length > 10
                  ? destination.destinationName.slice(0, 9) + '...'
                  : destination.destinationName}

                <hr />
                {destination.destinationContent.length > 50
                  ? destination.destinationContent.slice(0, 50) + '...'
                  : destination.destinationContent}
              </BackText>
            </Back>
          )}
        </SiteItem>
      ))}
    </Masonry>
    // </Box>
  );
};

const SiteItem = styled.div`
  margin: 5px; /* 위아래 및 좌우 간격을 조정할 margin 값 */
  padding: 10px 0px 10px 10px;
  border-radius: 5px;
  max-width: 47%;
  /* max-height: 80px; */
  text-align: center;
  position: relative;
`;

const SiteImage = styled.img<{ isFlipped: boolean }>`
  margin: 5px;
  max-width: 100%;
  margin-top: -25px;
  margin-bottom: -30px;
  /* height: auto; */
  object-fit: cover;
  border-radius: 10px;
  transform: ${({ isFlipped }) =>
    isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'}; // 클릭 시 뒤집힌 이미지의 회전
  transition: transform 0.5s ease; // 부드러운 애니메이션 효과 추가
`;

const Back = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  margin-right: -6px;
  margin-bottom: -20px;
  background-color: rgba(255, 255, 255, 0.8);
  backface-visibility: hidden; // 뒷면 텍스트가 앞면에 보이지 않도록 함
  display: flex;
  justify-content: center; /* 가로 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
`;

const BackText = styled.p`
  font-size: 12px;
  font-weight: bold;
  color: black;
  font-family: 'Pretendard';
  text-align: center; // 가운데 정렬
  padding: 10px;
  padding-left: 15px;
  letter-spacing: 1px;
  white-space: pre-line; /* 줄바꿈 유지 */
  line-height: 1.5;
`;

const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  top: 20px;
  right: -70px;
  z-index: 1;
`;

export default SitePictures;
