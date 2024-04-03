import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findFriend } from '../../utils/axios/axios-travel';
import { useTravelSave } from '../../store/useTravelStore';
import useUserInfo from '../../store/useUserStore';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Swal from 'sweetalert2';

const MakeGroup = () => {
  const navigate = useNavigate();
  const [nameTag, setNameTag] = useState('');
  const [searchResult, setSearchResult] = useState<any>([]);
  const [groupList, setGroupList] = useState<any>([]);
  const travelSaveStore = useTravelSave();
  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (travelSaveStore.travel.startDate === '' || travelSaveStore.travel.endDate === '') {
      navigate('/');
    }
  }, []);

  const searchNameTag = () => {
    //친구 검색 api
    findFriend(nameTag)
      .then((response: any) => {
        //친구 배열
        const searchResult = response.data.data;
        const filteredFriends = searchResult.filter((friend: any) => {
          const groupUserIds = groupList.map((groupItem: any) => groupItem.userId);
          return !groupUserIds.includes(friend.userId) && friend.userId != userInfo.userId;
        });
        setSearchResult(filteredFriends);
      })
      .catch((err: Error) => {
        Swal.fire({
          icon: 'warning',
          text: '이름이나 태그를 다시 한 번 확인해주세요!',
        });
        console.error(err);
      });
  };

  const clearNameTag = () => {
    setNameTag('');
  };

  const addGroup = (el: any) => {
    setGroupList([...groupList, el]);
    setSearchResult(searchResult.filter((item: any) => item.userId !== el.userId));
  };

  const deleteGroup = (el: any) => {
    const filteredList = groupList.filter((item: any) => item.userId !== el.userId);
    setGroupList(filteredList);
    reFindFriend(filteredList);
  };

  const reFindFriend = (list: any) => {
    findFriend(nameTag)
      .then((response: any) => {
        const searchResult = response.data.data;
        const filteredFriends = searchResult.filter((friend: any) => {
          const groupUserIds = list.map((groupItem: any) => groupItem.userId);
          return !groupUserIds.includes(friend.userId) && friend.userId != userInfo.userId;
        });
        setSearchResult(filteredFriends);
      })
      .catch((err: Error) => {
        alert('이름이나 태그를 다시 한 번 확인해주세요!');
        console.error(err);
      });
  };
  const saveButton = () => {
    const idList = groupList.map((el: any) => {
      return el.userId;
    });
    travelSaveStore.setTravel({
      cityName: '',
      startDate: travelSaveStore.travel.startDate,
      endDate: travelSaveStore.travel.endDate,
      friendIdList: [...idList],
      transportation: travelSaveStore.travel.transportation,
      courseList: [],
    });
    navigate('/course/province');
  };

  return (
    <>
      <PageContainer>
        <SearchContainer>
          <SearchCancle
            onClick={() => {
              navigate('/course/alonetogether');
            }}
          >
            <KeyboardBackspaceIcon />
          </SearchCancle>
          <SearchInput>
            <TextField
              sx={{
                '& fieldset': { border: 'none' },
                boxShadow: '0.5px 1px 1px gray',
                borderRadius: '10px',
              }}
              id="search-name-tag"
              placeholder="이름 혹은 #태그 검색"
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
                    <SearchIcon
                      fontSize="large"
                      onClick={searchNameTag}
                      style={{ cursor: 'pointer' }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <HighlightOffIcon
                      fontSize="small"
                      onClick={clearNameTag}
                      style={{ cursor: 'pointer' }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </SearchInput>
        </SearchContainer>

        <GroupContainer>
          <MainText>그룹원</MainText>
          <GroupResultContainer>
            {groupList &&
              groupList.map((el: any, index: number) => (
                <GroupResultFriend key={index}>
                  {el.nickname} #{el.tag}
                  <HighlightOffIcon
                    fontSize="small"
                    color="disabled"
                    style={{ cursor: 'pointer', position: 'relative', top: '5px', left: '2px' }}
                    onClick={() => deleteGroup(el)}
                  />
                </GroupResultFriend>
              ))}
          </GroupResultContainer>
        </GroupContainer>

        <ResultContainer>
          <MainText>검색 결과</MainText>
          <ResultBoxContainer>
            {searchResult &&
              searchResult.map((el: any, index: number) => (
                <SearchResultFriend key={index} onClick={() => addGroup(el)}>
                  {el.nickname} #{el.tag}
                </SearchResultFriend>
              ))}
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
  width: 95%;
  padding: 20px 10px;
  font-size: 1.2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background: #566cf038;
  margin-right: 20px;
  border-radius: 10px;
`;

const SearchCancle = styled.div`
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  min-height: 40px;
  background: #566cf038;
  padding: 15px 15px;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
`;

const GroupResultFriend = styled.span`
  background: white;
  padding: 10px 8px 18px;
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
  min-height: 250px;
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
  width: 330px;
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
export default MakeGroup;
