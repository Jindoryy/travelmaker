import styled from 'styled-components';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

interface DiaryAlertProps {
  handleDisplayAlert: (event?: MouseEvent) => void; // 이벤트 객체를 선택적으로 받도록 수정
}

const DiaryAlert: React.FC<DiaryAlertProps> = ({ handleDisplayAlert }) => {
  const navigate = useNavigate();

  const getImage = () => {
    return require('../../assets/image/letter.png');
  };

  const handleTouch = () => {
    navigate('/mypage');
  };

  return (
    <>
      <Overlay>
        <Container>
          <CloseIcon onClick={() => handleDisplayAlert()} />
          <Div5 onClick={handleTouch}>
            <Img loading="lazy" src={getImage()} />
            <Div2>
              <Div3>일기쓰기</Div3>
              <Div4>여행의 후기를 작성해보세요</Div4>
            </Div2>
          </Div5>
        </Container>
      </Overlay>
    </>
  );
};

export default DiaryAlert;

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Container = styled.div`
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  gap: 12px;
  font-size: 16px;
  font-weight: 400;
  padding: 18px 52px 18px 21px;
  z-index: 999;
  position: relative; /* X 아이콘 위치 조정을 위해 relative 설정 */
`;

const CloseIcon = styled(AiOutlineCloseCircle)`
  position: absolute;
  top: 5px; /* 약간 위로 올림 */
  right: 5px; /* 우측 상단에 위치 */
  cursor: pointer; /* 클릭 가능한 요소임을 나타냄 */
  width: 30px; /* 아이콘 크기 조정 */
  height: 30px; /* 아이콘 크기 조정 */
  color: #898989; /* 아이콘 색상 조정 */
`;

const Img = styled.img`
  width: 60px;
  margin-right: 10px;
`;

const Div2 = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto 0;
`;

const Div3 = styled.div`
  color: #898989;
  font-family:
    Noto Sans KR,
    sans-serif;
`;

const Div4 = styled.div`
  color: #000;
  font-family:
    Noto Sans KR,
    sans-serif;
  margin-top: 7px;
`;

const Div5 = styled.div`
  display: flex;
  cursor: pointer;
  user-select: none;
`;
