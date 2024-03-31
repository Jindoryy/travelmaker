import styled from 'styled-components';
import ProvinceHeader from '../../components/course/ProvinceHeader';
import ProvinceButtonSlide from '../../components/course/ProvinceButtonSlide';
import ProvinceWideButtonList from '../../components/course/ProvinceWideButtonList';

const ProvinceChoicePage = () => {
  return (
    <>
      <PageContainer>
        <ProvinceHeader />
        <ProvinceButtonSlide />
        <ProvinceWideButtonList />
        <FooterMargin />
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  border-radius: 10px;
  /* background-color: #eff1fe; */
  display: flex;
  max-width: 410px;
  flex-direction: column;
  padding: 10px;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
`;

const FooterMargin = styled.div`
  height: 80px;
`;

export default ProvinceChoicePage;
