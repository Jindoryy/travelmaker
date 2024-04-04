import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { SVGProps } from 'react';

// 이미지 파일을 import
const getProfileImage = () => {
  return require('../../assets/image/WorldMap.png');
};

const MyCourseListDiv = (props: SVGProps<SVGSVGElement>) => {
  const navigate = useNavigate();
  return (
    <CourseListContainer
      onClick={() => {
        navigate('/mypage');
      }}
    >
      {/* 이미지 컴포넌트로 사용 */}
      <img src={getProfileImage()} alt="World Map" />
      <div>
        <h2 className="greytext">여행코스보기</h2>
        <h2 className="boldtext">여행 코스를 확인하세요</h2>
      </div>
      <GotoPageButton>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25px"
          height="25px"
          viewBox="0 0 24 24"
          {...props}
        >
          <g fill="none" fillRule="evenodd">
            <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
            <path
              fill="currentColor"
              d="M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12L8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z"
            ></path>
          </g>
        </svg>
      </GotoPageButton>
    </CourseListContainer>
  );
};

export default MyCourseListDiv;

const CourseListContainer = styled.div`
  width: 85%;
  border-radius: 15px;
  background-color: white;
  margin: 5px;
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;

  img {
    width: 50px; /* 이미지 너비 조정 */
    height: 50px; /* 이미지 높이 조정 */
    margin-right: 10px;
    margin-left: 10px;
  }
  .greytext {
    color: #898989;
    /* font-weight: bold; */
    text-align: left;
    margin-bottom: 8px;
    font-size: 15px;
    margin-right: 10px;
  }
  .boldtext {
    font-weight: bold;
    font-size: 20px;
    margin-right: 20px;
  }
`;

const GotoPageButton = styled.div`
  margin-left: 10px;
`;
