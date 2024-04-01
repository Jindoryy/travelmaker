import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const MakeGroup = () => {
  const navigate = useNavigate();
  const [nameTag, setNameTag] = useState('');

  const searchNameTag = () => {
    //친구 검색 api
    console.log(nameTag);
  };

  const clearNameTag = () => {
    //검색어 clear
    setNameTag('');
  };

  const saveButton = () => {
  };

  return (
    <>
      <PageContainer>
        <SearchContainer>
          <SearchInput>
            <TextField
              sx={{ width: '31ch' }}
              id="search-name-tag"
              placeholder='이름 혹은 태그 검색'
              fullWidth
              autoFocus
              value={nameTag}
              onChange={(e) => setNameTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchNameTag();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="large" onClick={searchNameTag} style={{ cursor: 'pointer' }}/>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <HighlightOffIcon fontSize="small" onClick={clearNameTag} style={{ cursor: 'pointer' }} />
                  </InputAdornment>
                ),
              }}
            />
          </SearchInput>
          <SearchCancle 
            onClick={()=>{
              navigate('/course/alonetogether');
            }}>취소</SearchCancle>
        </SearchContainer>

        <GroupContainer>
          <MainText>그룹원</MainText>
          <GroupResultContainer>
            <GroupResultFriend>
              김이름 #39283824
              <HighlightOffIcon 
                fontSize="small" 
                style={{ cursor: 'pointer', position:'relative', top:'5px', left:'2px'}}/>
            </GroupResultFriend>
          </GroupResultContainer>
        </GroupContainer>

        <ResultContainer>
          <MainText>검색 결과</MainText>
          <ResultBoxContainer>
            <SearchResultFriend>김이름 #39283824</SearchResultFriend>
            <SearchResultFriend>김이름 #39283824</SearchResultFriend>
          </ResultBoxContainer>
        </ResultContainer>

        <ButtonBox>
          <ChooseButton onClick={() => saveButton()}>다음</ChooseButton>
        </ButtonBox>
      </PageContainer>
    </>
  );
};
const PageContainer = styled.div`
  width:412px;
  padding: 25px 0px 0px;
  font-size: 1.2rem
`;
const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;
const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background: #566cf038;
  margin-right: 20px;
`;
const SearchCancle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const MainText = styled.div`
  // font-weight: bold;
  margin-bottom: 8px;
`;
const GroupContainer = styled.div`
  margin: 0px 12px 30px;
`;
const GroupResultContainer = styled.div`
  background: #566cf038;
  padding: 15px 15px;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
`;
const GroupResultFriend = styled.span`
  background: white;
  padding: 10px 8px 14px;
  margin: 6px 6px;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  font-size: 0.9rem;
`;
const SearchResultFriend = styled.span`
  background: white;
  margin: 7px;
  padding: 15px;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  font-size: 1.1rem;
  cursor: pointer;
`;
const ResultContainer = styled.div`
  margin: 0px 12px 30px;
`;
const ResultBoxContainer = styled.div`
  background: #566cf038;
  padding: 15px 15px;
  border-radius: 8px;
  min-height: 370px;
  display: flex;
  flex-direction: column;
`;

const ButtonBox = styled(Box)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
export default MakeGroup;
