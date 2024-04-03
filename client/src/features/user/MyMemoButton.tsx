import React, { useState } from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import MyMemoList from '../../components/user/MyMemoList';

const getImage = () => {
  return require('../../assets/image/BookmarkTabs.png');
};

interface MyMemoButtonProps {
  travelId: number; // 혹은 다른 유형에 맞게 설정
}

const MyMemoButton: React.FC<MyMemoButtonProps> = ({ travelId }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <>
      <MemoButton onClick={toggleDrawer}>
        {/* 이미지 컴포넌트로 사용 */}
        <img src={getImage()} alt="BookmarkTabs" />
        <div>
          <h2 className="greytext">메모장</h2>
          <h2 className="boldtext">여행 준비물을 적어보세요</h2>
        </div>
      </MemoButton>
      <StyledDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          style: {
            height: '60%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <MyMemoList travelId={travelId} />
      </StyledDrawer>
    </>
  );
};

export default MyMemoButton;

const MemoButton = styled.div`
  width: 85%;
  border-radius: 15px;
  background-color: white;
  margin: 5px;
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;

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

const StyledDrawer = styled(Drawer)`
  // Drawer 스타일링 영역
  border-radius: 20px;
`;
