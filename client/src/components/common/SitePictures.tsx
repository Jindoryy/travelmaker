import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { siteListDetail, nonLoginsiteList, likeDestination } from '../../utils/axios/axios-travel';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserInfo from '../../store/useUserStore';
import Masonry from '@mui/lab/Masonry';
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

interface NonLoginSiteListProps {
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
          likes_flag: boolean;
        },
      ];
    };
  };
}

const SitePictures = () => {
  const navigate = useNavigate();
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

  const [nonLoginSiteInfoList, setNonLoginSiteInfoList] = useState<NonLoginSiteListProps>({
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
            likes_flag: false,
          },
        ],
      },
    },
  });

  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [imageHeights, setImageHeights] = useState<number[]>([]);
  const location = useLocation();
  const { userInfo } = useUserInfo();
  const userId = userInfo.userId;

  useEffect(() => {
    if (userId === -1) {
      getNonLoginSiteInfoList();
    } else {
      getSiteInfoList();
    }
  }, []);

  useEffect(() => {
    let heights;
    if (userId === -1) {
      heights = nonLoginSiteInfoList.data.destinationListResponseMap.basic.map(() =>
        getRandomHeight(),
      );
    } else {
      heights = siteInfoList.data.destinationListResponseMap.basic.map(() => getRandomHeight());
    }
    setImageHeights(heights);
  }, [userId, nonLoginSiteInfoList, siteInfoList]);

  const handleImageClick = (index: number) => {
    setFlippedIndex(index === flippedIndex ? null : index);
  };
  const handleCheckboxChange =
    (destinationId: number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (userId === -1) {
        // 비로그인 상태에서는 로그인 페이지로 이동
        // 예시: '/login'은 실제로 로그인 페이지의 경로여야 합니다.
        navigate('/login');
        return;
      }

      if (event.target.checked) {
        try {
          const response = await likeDestination(userId, destinationId);
        } catch (error) {
          console.error('Error occurred while liking destination:', error);
        }
      } else {
        try {
          const response = await likeDestination(userId, destinationId);
        } catch (error) {
          console.error('Error occurred while liking destination:', error);
        }
      }
    };

  const getSiteInfoList = () => {
    siteListDetail()
      .then((response) => {
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

  const getNonLoginSiteInfoList = () => {
    nonLoginsiteList()
      .then((response) => {
        const nonLoginSiteListResponse: NonLoginSiteListProps = {
          status: response.data.status,
          data: response.data.data,
        };
        setNonLoginSiteInfoList(nonLoginSiteListResponse);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const getRandomHeight = () => {
    return Math.floor(Math.random() * 200) + 150;
  };

  const combinedArray =
    userId === -1
      ? [...nonLoginSiteInfoList.data.destinationListResponseMap.basic]
      : [
          ...siteInfoList.data.destinationListResponseMap.popular,
          ...siteInfoList.data.destinationListResponseMap.basic,
        ];

  return (
    <Masonry columns={2} spacing={1} sequential>
      {combinedArray.map((destination, index) => (
        <SiteItem key={index}>
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
            loading="lazy"
            style={{ height: `${imageHeights[index]}px` }}
            src={destination.destinationImgUrl}
            alt={destination.destinationName}
            onClick={() => handleImageClick(index)}
            isFlipped={index === flippedIndex}
          />

          {index === flippedIndex && (
            <Back onClick={() => handleImageClick(index)}>
              {destination.destinationContent ? (
                <BackText>
                  {destination.destinationName.length > 10
                    ? destination.destinationName.slice(0, 9) + '...'
                    : destination.destinationName}
                  <hr />
                  {destination.destinationContent.length > 50
                    ? destination.destinationContent.slice(0, 50) + '...'
                    : destination.destinationContent}
                </BackText>
              ) : (
                <BackText>
                  {destination.destinationName.length > 10
                    ? destination.destinationName.slice(0, 9) + '...'
                    : destination.destinationName}
                </BackText>
              )}
            </Back>
          )}
        </SiteItem>
      ))}
    </Masonry>
  );
};

const SiteItem = styled.div`
  margin: 5px;
  padding: 10px 0px 10px 10px;
  border-radius: 5px;
  max-width: 47%;
  text-align: center;
  position: relative;
`;

const SiteImage = styled.img<{ isFlipped: boolean }>`
  margin: 5px;
  max-width: 100%;
  margin-top: -25px;
  margin-bottom: -30px;
  object-fit: cover;
  border-radius: 10px;
  transform: ${({ isFlipped }) => (isFlipped ? 'rotateY(180deg)' : 'rotateY(0)')};
  transition: transform 0.5s ease;
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
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackText = styled.p`
  font-size: 12px;
  font-weight: bold;
  color: black;
  text-align: center;
  padding: 10px;
  padding-left: 15px;
  letter-spacing: 1px;
  white-space: pre-line;
  line-height: 1.5;
`;

const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  top: 20px;
  right: -40%;
  z-index: 1;
`;

export default SitePictures;
