import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { SVGProps } from 'react';
import Box from '@mui/material/Box';
import {
  getMemoList,
  createMemoList,
  deleteMemoList,
  CreateMemoRequestBody,
} from '../../utils/axios/axios-user';

interface MyMemoListProps extends SVGProps<SVGSVGElement> {
  travelId: number;
}

const MyMemoList = ({ travelId, ...props }: MyMemoListProps) => {
  const [memos, setMemos] = useState<any>(null);
  const [newMemo, setNewMemo] = useState<string>('');

  useEffect(() => {
    getMemoList(travelId)
      .then((response) => {
        const getMemo = response.data;
        let updatedMemo = getMemo;
        gotMemo(updatedMemo);
      })
      .catch((error) => {
        console.error('메모를 불러오는 중 오류가 발생했습니다:', error);
      });
  }, [travelId]);

  const handleAddMemo = () => {
    const requestBody: CreateMemoRequestBody = {
      travelId: travelId,
      memo: newMemo,
    };

    createMemoList(requestBody)
      .then((response) => {
        getMemoList(travelId)
          .then((response) => {
            const updatedMemos = response.data;
            setMemos(updatedMemos);
            setNewMemo('');
          })
          .catch((error) => {
            console.error('메모 목록을 갱신하는 중 오류가 발생했습니다:', error);
          });
      })
      .catch((error) => {
        console.error('메모를 추가하는 중 오류가 발생했습니다:', error);
      });
  };

  const handleDeleteMemo = (memoId: number) => {
    deleteMemoList(memoId)
      .then(() => {
        getMemoList(travelId)
          .then((response) => {
            const updatedMemos = response.data;
            setMemos(updatedMemos);
          })
          .catch((error) => {
            console.error('메모 목록을 갱신하는 중 오류가 발생했습니다:', error);
          });
      })
      .catch((error) => {
        console.error('메모를 삭제하는 중 오류가 발생했습니다:', error);
      });
  };

  const gotMemo = (updatedMemo: any) => {
    setMemos(updatedMemo);
  };

  useEffect(() => {}, [memos]);

  return (
    <CenteredContainer>
      {memos && memos.length ? (
        <Box component="form" noValidate autoComplete="off">
          <h2>여행 메모장</h2>
          <StyledInput
            type="text"
            placeholder="새로운 메모를 입력하세요."
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
          />
          <StyledButton onClick={handleAddMemo}>추가</StyledButton>
          <MemoItems>
            {memos.map((memo: any) => (
              <MemoItem key={memo.id}>
                <MemoText>{memo.memo}</MemoText>
                <DeleteButton onClick={() => handleDeleteMemo(memo.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={32}
                    height={32}
                    viewBox="0 0 24 24"
                    {...props}
                  >
                    <path
                      fill="none"
                      stroke="#a6a6a6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 5H9l-7 7l7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-2 4l-6 6m0-6l6 6"
                    ></path>
                  </svg>
                </DeleteButton>
              </MemoItem>
            ))}
          </MemoItems>
        </Box>
      ) : (
        <Box component="form" noValidate autoComplete="off">
          <h2>여행 메모장</h2>
          <StyledInput
            type="text"
            placeholder="새로운 메모를 입력하세요."
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
          />
          <StyledButton onClick={handleAddMemo}>추가</StyledButton>
          <p>메모를 추가해주세요.</p>
        </Box>
      )}
    </CenteredContainer>
  );
};

export default MyMemoList;

const CenteredContainer = styled.div`
  margin-left: 35%;
  padding-right: 30%;
  width: 412px;
  display: flex;
  align-items: center;

  h2 {
    margin-top: -160px;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-left: 25%;
  }
`;

const MemoItems = styled.div``;

const MemoItem = styled.div`
  width: 380px;
  height: 50px;
  text-align: left;
  display: flex;
  align-items: center;
  padding-left: 10px;
  background-color: #eff1fe;
  border-radius: 10px;
  margin-bottom: 5px;
`;

const MemoText = styled.p`
  margin-left: 10px;
`;

const StyledButton = styled.button`
  text-decoration: none;
  background-color: #d7daf9;
  width: 80px;
  height: 50px;
  border-radius: 10px;
  border: 4px solid #566cf0;
  margin-left: 10px;
  cursor: pointer;
`;

const StyledInput = styled.input`
  width: 300px;
  height: 50px;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  border: 4px solid #566cf0;
  box-sizing: border-box;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
`;

const DeleteIcon = styled.svg`
  fill: #a6a6a6;
`;
