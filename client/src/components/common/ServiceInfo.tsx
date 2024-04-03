import React, { useState } from 'react';
import styled from 'styled-components';
import type { SVGProps } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';

const ServiceInfo = (props: SVGProps<SVGSVGElement>) => {
  const [isVisible, setIsVisible] = useState(true);
  const handleButtonClick = () => {
    setIsVisible(false); // 버튼 클릭 시 상태 변경하여 컴포넌트 숨기기
  };
  return isVisible ? (
    <CourseListContainer>
      <div>
        <h2 className="boldtext">하단의 마음에 드는 여행지에 </h2>
        <h2 className="boldtext">
          <Checkbox
            sx={{
              color: pink[600],
              '&.Mui-checked': {
                color: pink[600],
              },
              width: '3px',
              height: '3px',
              marginRight: '8px',
            }}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
          />를 눌러보세요!</h2>
        <h2 className="boldtext">코스 추천에 도움이 될거예요.</h2>
        <h2 className="greytext">(사진을 클릭하면 어떤 장소인지 알 수 있답니다)</h2>
      </div>
      <DeleteButton onClick={handleButtonClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 14 14"
          {...props}
          color='#FFC65C'
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z"
            clipRule="evenodd"
            
          ></path>
        </svg>
      </DeleteButton>
    </CourseListContainer>
  ) : null; // isVisible이 false이면 컴포넌트를 숨김
};


const CourseListContainer = styled.div`
width: 85%; 
border-radius: 15px;
background-color: #fefdd5;
margin: 10px;
padding: 20px;
padding-top: 25px;
padding-bottom: 25px;
display: flex;
align-items: center;
justify-content: center;
text-align: center;
position: relative;

.greytext {
  color: grey;
  /* font-weight: bold; */
  text-align: left;
  padding-left: 10px;
  font-size: 15px;
  margin-right: 10px;
}
.boldtext {
  font-weight: bold;
  font-size: 18px;
  margin-right: 20px;
  margin-bottom: 8px;
  padding-left: 35px;
}
`;
const DeleteButton = styled.div`
position: absolute;
top: 13px;
right: 15px;
`;

export default ServiceInfo;