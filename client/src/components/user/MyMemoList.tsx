import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { SVGProps } from 'react';
import { getMemoList } from '../../utils/axios/axios-user';

const MyMemoList = (props: SVGProps<SVGSVGElement>) => {
  const [memos, setMemos] = useState<{ id: number; travelId: number; memo: string }[] | null>(null);

  useEffect(() => {
    // 여기서 travelId를 적절하게 가져와서 사용하세요
    const travelId = 22;
    getMemoList(travelId)
      .then((response) => {
        setMemos(response.data.data);
        console.log(memos);
      })
      .catch((error) => {
        console.error('메모를 불러오는 중 오류가 발생했습니다:', error);
      });
  }, []);

  if (memos === null) {
    return <p>Loading...</p>; // 데이터 로딩 중일 때 표시할 컴포넌트
  }
  return (
    <Container>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 20 20"
        {...props}
      >
        <path
          fill="#a6a6a6"
          fillRule="evenodd"
          d="M1 10a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1"
          clipRule="evenodd"
        ></path>
      </svg>
      <h2>여행 메모장</h2>
      {/* <MemoItems>
        {memos.length === 0 ? (
          <p>메모가 없습니다.</p>
        ) : (
          memos.map((memo) => (
            <MemoItem key={memo.id}>
              <p>{memo.memo}</p>
            </MemoItem>
          ))
        )}
      </MemoItems> */}
    </Container>
  );
};
export default MyMemoList;
const Container = styled.div`
  /* 스타일링 */
`;

const MemoItems = styled.div`
  /* 스타일링 */
`;

const MemoItem = styled.div`
  /* 스타일링 */
`;
