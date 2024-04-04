import styled from 'styled-components';
import ProvinceHeader from '../../components/course/ProvinceHeader';
import ProvinceButtonSlide from '../../components/course/ProvinceButtonSlide';
import ProvinceWideButtonList from '../../components/course/ProvinceWideButtonList';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTravelSave } from '../../store/useTravelStore';

const ProvinceChoicePage = () => {
  const navigate = useNavigate();
  const travelSave = useTravelSave();
  useEffect(() => {
    if (travelSave.travel.startDate === '' || travelSave.travel.endDate === '') {
      navigate('/');
    }
  }, []);
  return (
    <>
      <PageContainer>
        <ProvinceHeader />
        <ProvinceButtonSlide />
        <ProvinceWideButtonList />
        {/* <FooterMargin /> */}
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  border-radius: 10px;
  /* background-color: #eff1fe; */
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 100vh;
  min-height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
`;

const FooterMargin = styled.div`
  height: 80px;
`;

export default ProvinceChoicePage;
