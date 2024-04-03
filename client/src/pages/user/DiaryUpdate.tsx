import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DiaryUpdate = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageContainer>
        <TitleContainer>
          <TitleCity>대구</TitleCity>
          <TitleDate>2024.02.15 ~ 2024.02.17</TitleDate>
        </TitleContainer>
        <PhotoContainer>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            style={{ backgroundColor: '#566CF0' }}
          >
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button>
        </PhotoContainer>
        <ContentContainer>
          <StyledTextarea
            placeholder="일기를 작성해보세요."
            id="text"
            value={
              '내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다'
            }
          ></StyledTextarea>
        </ContentContainer>
        <ButtonBox>
          <ChooseButton>수정</ChooseButton>
          <ChooseButtonBorder>취소</ChooseButtonBorder>
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
  padding: 20px 20px;
  border-radius: 8px;
`;
const ContentContainer = styled.div`
  background-color: white;
  margin: 0px 12px 10px;
  padding: 20px 20px;
  border-radius: 8px;
  min-height: 230px;
`;
const StyledTextarea = styled.textarea`
  resize: none;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  outline: none;
  width: 340px;
  min-height: 420px;
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

export default DiaryUpdate;
