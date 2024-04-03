import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
      const selectedFiles = Array.from(event.target.files);
      // 중복된 파일이 있는지 검사하고, 있을 경우 사용자에게 알림
      const isDuplicate = selectedFiles.some((newFile) =>
        files.find((existingFile) => existingFile.name === newFile.name),
      );

      if (isDuplicate) {
        Swal.fire({
          icon: 'warning',
          title: '중복된 파일이 있어요',
          text: '같은 이름의 파일은 업로드할 수 없습니다.',
        });
      }

      // 중복 제거 후, 새로운 파일만 추가
      const newFiles = selectedFiles.filter(
        (newFile) => !files.some((existingFile) => existingFile.name === newFile.name),
      );

      // 파일 총 갯수 제한 초과 시 알림
      if (files.length + newFiles.length > 10) {
        Swal.fire({
          icon: 'error',
          title: '파일 최대 갯수 초과',
          text: '최대 10개의 파일만 업로드할 수 있습니다.',
        });
        return;
      }

      // 중복이 아닌 새로운 파일들을 기존 파일 목록에 추가
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDeleteFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
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
          <FileListContainer>
            {files.slice(0, 3).map((file, index) => (
              <FileNameAndDeleteButton key={file.name}>
                <FileName>{file.name}</FileName>
                <DeleteForeverIcon onClick={() => handleDeleteFile(file.name)} />
              </FileNameAndDeleteButton>
            ))}
            {files.length > 3 && <Ellipsis>...</Ellipsis>}
          </FileListContainer>
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

const FileListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
`;

const FileNameAndDeleteButton = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const FileName = styled.span`
  font-size: 15px;
  margin-right: 10px;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 200px; /* Adjust based on your container's size */
`;

const DeleteButton = styled.button`
  font-size: 0.8rem;
  color: #f00;
  background: transparent;
  border: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Ellipsis = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

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
