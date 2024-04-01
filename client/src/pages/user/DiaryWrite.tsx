import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getTravelDetailDiary } from '../../utils/axios/axios-travel';
import { TravelDetailData } from '../../utils/axios/axios-travel';
import { postDiaryWithFiles } from '../../utils/axios/axios-diary';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

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

const DiaryWrite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);
  const { travelId } = location.state || {};
  const [travelData, setTravelData] = useState<Partial<TravelDetailData>>({});
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    getTravelDetailDiary(travelId)
      .then((res) => {
        setTravelData(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (event.target.files.length > 10) {
        alert('최대 10개까지 업로드 가능합니다.');
        event.target.value = '';
        return;
      }
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = () => {
    const diaryText = document.getElementById('text') as HTMLTextAreaElement;
    const formData = new FormData();

    if (files.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '일기에 추억을 담아 주세요!',
      });
      return;
    }

    files.forEach((file) => {
      formData.append('files', file);
    });

    const diaryAddRequestBlob = new Blob(
      [
        JSON.stringify({
          travelId: travelId,
          text: diaryText.value,
        }),
      ],
      { type: 'application/json' },
    );
    formData.append('diaryAddRequest', diaryAddRequestBlob);
    postDiaryWithFiles(formData)
      .then((response) => {
        console.log(response.data);
        navigate('/mypage?tab=2');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <PageContainer>
        <TitleContainer>
          <TitleCity>{travelData.cityName}</TitleCity>
          <TitleDate>
            {travelData.startDate} ~ {travelData.endDate}
          </TitleDate>
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
            <VisuallyHiddenInput type="file" multiple onChange={handleFileChange} />
          </Button>
        </PhotoContainer>
        <ContentContainer>
          <StyledTextarea placeholder="일기를 작성해보세요." id="text"></StyledTextarea>
        </ContentContainer>
        <ButtonBox>
          <ChooseButton onClick={handleSubmit}>작성</ChooseButton>
          <ChooseButtonBorder>목록</ChooseButtonBorder>
        </ButtonBox>
      </PageContainer>
    </>
  );
};

export default DiaryWrite;

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
