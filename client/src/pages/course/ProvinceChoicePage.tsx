import styled from 'styled-components';
import ProvinceHeader from '../../components/course/ProvinceHeader';
import ProvinceList from '../../components/course/ProvinceList';

const ProvinceChoicePage = () => {
  return (
    <>
      <PageContainer>
        <ProvinceHeader />
        <ProvinceList />
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  border-radius: 10px;
  background-color: #eff1fe;
  display: flex;
  max-width: 350px;
  flex-direction: column;
  padding: 10px;
`;

export default ProvinceChoicePage;
