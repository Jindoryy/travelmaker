import styled from 'styled-components';

const ErrorPage = () => {
  return (
    <NotFoundContainer id="notfound">
      <NotFoundContent className="notfound">
        <NotFound404 className="notfound-404">
          <HeadingOne>404</HeadingOne>
        </NotFound404>
        <HeadingTwo>이런!</HeadingTwo>
        <Paragraph>찾을 수 없는 페이지예요</Paragraph>
        <Anchor href="/">메인페이지로 돌아가기</Anchor>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default ErrorPage;

const NotFoundContainer = styled.div`
  position: relative;
  height: 100vh;
`;

const NotFoundContent = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 767px;
  width: 100%;
  line-height: 1.4;
  text-align: center;
  padding: 15px;
  display: flex;
  flex-direction: column;
  word-break: keep-all;
`;

const NotFound404 = styled.div`
  position: relative;
  height: 220px;
`;

const HeadingOne = styled.h1`
  font-family: 'Kanit', sans-serif;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 186px;
  font-weight: 200;
  margin: 0;
  background: linear-gradient(130deg, #ffa34f, #ff6f68);
  color: transparent;
  background-clip: text;
  text-transform: uppercase;
`;

const HeadingTwo = styled.h2`
  font-family: 'Kanit', sans-serif;
  font-size: 33px;
  font-weight: 200;
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 25px;
  letter-spacing: 3px;
`;

const Paragraph = styled.p`
  font-family: 'Kanit', sans-serif;
  font-size: 16px;
  font-weight: 200;
  margin-top: 0;
  margin-bottom: 25px;
`;

const Anchor = styled.a`
  font-family: 'Kanit', sans-serif;
  color: #ff6f68;
  font-weight: 200;
  text-decoration: none;
  border-bottom: 1px dashed #ff6f68;
  border-radius: 2px;
`;
