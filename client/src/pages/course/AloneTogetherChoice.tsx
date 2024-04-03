import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTravelSave } from '../../store/useTravelStore';
import { useEffect } from 'react';

const AloneTogetherChoice = () => {
  const navigate = useNavigate();
  const travelSaveStore = useTravelSave();
  useEffect(() => {
    if (travelSaveStore.travel.startDate === '' || travelSaveStore.travel.endDate === '') {
      navigate('/');
    }
  }, []);
  return (
    <>
      <PageContainer>
        <AloneTogetherContainer>
          <ChoiceBoxContainer
            onClick={() => {
              navigate('/course/province');
            }}
          >
            <img
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Raising%20Hand.png"
              alt="Man Raising Hand"
              width="120"
              height="120"
            />
            <ChoiceBoxText>혼자</ChoiceBoxText>
          </ChoiceBoxContainer>
          <ChoiceBoxContainer
            onClick={() => {
              navigate('/course/makegroup');
            }}
          >
            <img
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Family%20Man%2C%20Woman%2C%20Boy.png"
              alt="Family Man, Woman, Boy"
              width="120"
              height="120"
            />
            <ChoiceBoxText>같이</ChoiceBoxText>
          </ChoiceBoxContainer>
        </AloneTogetherContainer>
      </PageContainer>
    </>
  );
};
const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #566cf038;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const AloneTogetherContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
const ChoiceBoxContainer = styled.div`
  width: 40%;
  height: 170px;
  padding-top: 20px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;
const ChoiceBoxText = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-top: 8px;
`;

export default AloneTogetherChoice;
