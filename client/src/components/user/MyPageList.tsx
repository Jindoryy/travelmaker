import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getScheduleList, getDiaryList } from '../../utils/axios/axios-user';
import MyPageScheduleFeature from '../../features/user/MyPageScheduleFeature';
import MyPageDiaryFeature from '../../features/user/MyPageDiaryFeature';

const MyPageList = ({ userInfo }: MyPageHeaderProps) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    if (activeTab === 'tab1') {
      loadSchedules();
    } else {
      loadDiaries();
    }
  }, [activeTab]);

  const loadSchedules = () => {
    getScheduleList()
      .then((response) => {
        setSchedules(response.data.data);
      })
      .catch((error) => {
        console.error('Failed to load schedules:', error);
      });
  };

  const loadDiaries = () => {
    getDiaryList()
      .then((response) => {
        setDiaries(response.data.data);
      })
      .catch((error) => {
        console.error('Failed to load diaries:', error);
      });
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <WaveTop>
        <WaveSVG color="#FFFFFF" backgroundColor="#eff1fe" />
      </WaveTop>
      <Container>
        <TabContainer>
          <Tab onClick={() => handleTabClick('tab1')} isActive={activeTab === 'tab1'}>
            일정
          </Tab>
          <Tab onClick={() => handleTabClick('tab2')} isActive={activeTab === 'tab2'}>
            일기
          </Tab>
        </TabContainer>
        {activeTab === 'tab1' ? (
          <ScheduleContainer>
            {schedules.map((schedule) => (
              <MyPageScheduleFeature key={schedule.travelId} data={schedule} />
            ))}
          </ScheduleContainer>
        ) : (
          <DiaryContainer>
            {diaries.map((diary) => (
              <MyPageDiaryFeature key={diary.diaryId} data={diary} />
            ))}
          </DiaryContainer>
        )}
      </Container>
    </>
  );
};

export default MyPageList;

interface UserInfo {
  userId: number;
  profileUrl: string;
  nickName: string;
}

interface MyPageHeaderProps {
  userInfo: UserInfo;
}

interface TabProps {
  isActive: boolean;
}

interface WaveSVGProps {
  color: string; // SVG의 채워질 색
  backgroundColor: string; // SVG 배경색
}

interface Schedule {
  travelId: number;
  cityName: string;
  startDate: string;
  endDate: string;
  friendNameList: string[];
  imgUrl: string;
  status: 'BEFORE_DIARY' | 'AFTER_DIARY';
}

interface Diary {
  diaryId: number;
  name: string;
  startDate: string;
  endDate: string;
  imgUrls: string;
}

const Container = styled.div`
  display: flex;
  width: 370px;
  height: auto;
  margin-top: 30px;
  border-radius: 20px;
  background: white;
  box-shadow: 3px 3px 2px gray;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
`;

const WaveSVG: React.FC<WaveSVGProps> = ({ color, backgroundColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 70 500 60" preserveAspectRatio="none">
    <rect x="0" y="0" width="500" height="500" style={{ stroke: 'none', fill: backgroundColor }} />
    <path
      d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z"
      style={{ stroke: 'none', fill: color }}
    />
  </svg>
);

const WaveTop = styled.div`
  width: 100%;
  height: 20px; // 웨이브 높이 조정

  svg {
    width: 100%;
    height: 100%;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding-top: 20px;
`;

const Tab = styled.button<TabProps>`
  background-color: ${(props) => (props.isActive ? '#566CF0' : '#FFFFFF')};
  color: ${(props) => (props.isActive ? '#FFFFFF' : '#566CF0')};
  border: 1px solid ${(props) => (props.isActive ? '#566CF0' : '#566CF0')};
  width: 160px;
  height: 40px;
  border-radius: 10px 10px 0 0;
  font-weight: bold;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const ScheduleContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  margin-bottom: 20px;
`;

const DiaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 0 30px;
  margin-bottom: 20px;
`;
