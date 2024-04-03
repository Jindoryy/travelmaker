import React from 'react';
import styled from 'styled-components';

const API_KEY = process.env.REACT_APP_WEATHER_KEY;

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    id: number;
    description: string;
    icon: string;
  }[];
}

const Weather: React.FC<{ weather: WeatherData | null }> = ({ weather }) => {
  const weatherDescKo = [
    { id: 201, description: '가벼운 비를 동반한 천둥구름' },
    { id: 200, description: '비를 동반한 천둥구름' },
    { id: 202, description: '폭우를 동반한 천둥구름' },
    { id: 210, description: '약한 천둥구름' },
    { id: 211, description: '천둥구름' },
    { id: 212, description: '강한 천둥구름' },
    { id: 221, description: '불규칙적 천둥구름' },
    { id: 230, description: '약한 연무를 동반한 천둥구름' },
    { id: 231, description: '연무를 동반한 천둥구름' },
    { id: 232, description: '강한 안개비를 동반한 천둥구름' },
    { id: 300, description: '가벼운 안개비' },
    { id: 301, description: '안개비' },
    { id: 302, description: '강한 안개비' },
    { id: 310, description: '가벼운 적은비' },
    { id: 311, description: '적은비' },
    { id: 312, description: '강한 적은비' },
    { id: 313, description: '소나기와 안개비' },
    { id: 314, description: '강한 소나기와 안개비' },
    { id: 321, description: '소나기' },
    { id: 500, description: '악한 비' },
    { id: 501, description: '중간 비' },
    { id: 502, description: '강한 비' },
    { id: 503, description: '매우 강한 비' },
    { id: 504, description: '극심한 비' },
    { id: 511, description: '우박' },
    { id: 520, description: '약한 소나기 비' },
    { id: 521, description: '소나기 비' },
    { id: 522, description: '강한 소나기 비' },
    { id: 531, description: '불규칙적 소나기 비' },
    { id: 600, description: '가벼운 눈' },
    { id: 601, description: '눈' },
    { id: 602, description: '강한 눈' },
    { id: 611, description: '진눈깨비' },
    { id: 612, description: '소나기 진눈깨비' },
    { id: 615, description: '약한 비와 눈' },
    { id: 616, description: '비와 눈' },
    { id: 620, description: '약한 소나기 눈' },
    { id: 621, description: '소나기 눈' },
    { id: 622, description: '강한 소나기 눈' },
    { id: 701, description: '박무' },
    { id: 711, description: '연기' },
    { id: 721, description: '연무' },
    { id: 731, description: '모래 먼지' },
    { id: 741, description: '안개' },
    { id: 751, description: '모래' },
    { id: 761, description: '먼지' },
    { id: 762, description: '화산재' },
    { id: 771, description: '돌풍' },
    { id: 781, description: '토네이도' },
    { id: 800, description: '구름 한 점 없는 맑은 하늘' },
    { id: 801, description: '약간의 구름이 낀 하늘' },
    { id: 802, description: '드문드문 구름이 낀 하늘' },
    { id: 803, description: '구름이 거의 없는 하늘' },
    { id: 804, description: '구름으로 뒤덮인 흐린 하늘' },
    { id: 900, description: '토네이도' },
    { id: 901, description: '태풍' },
    { id: 902, description: '허리케인' },
    { id: 903, description: '한랭' },
    { id: 904, description: '고온' },
    { id: 905, description: '바람부는' },
    { id: 906, description: '우박' },
    { id: 951, description: '바람이 거의 없는' },
    { id: 952, description: '약한 바람' },
    { id: 953, description: '부드러운 바람' },
    { id: 954, description: '중간 세기 바람' },
    { id: 955, description: '신선한 바람' },
    { id: 956, description: '센 바람' },
    { id: 957, description: '돌풍에 가까운 센 바람' },
    { id: 958, description: '돌풍' },
    { id: 959, description: '심각한 돌풍' },
    { id: 960, description: '폭풍' },
    { id: 961, description: '강한 폭풍' },
    { id: 962, description: '허리케인' },
  ];
  const getKoreanDescription = (id: number): string => {
    const found = weatherDescKo.find((item) => item.id === id);
    return found ? found.description : '';
  };

  return (
    <WeatherBoxContainer className="weather-box">
      <div className="weather-data">
        <div className="weather-img-wrap">
          <img src={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}></img>
        </div>
        {weather && (
          <>
            <h3 className="weatherinfo">{getKoreanDescription(weather.weather[0].id)}</h3>
            <h3>
              {`${Math.round(weather?.main.temp_max)}℃`} /{' '}
              {`${Math.round(weather?.main.temp_min)}℃`}
            </h3>
          </>
        )}
      </div>
    </WeatherBoxContainer>
  );
};

export default Weather;

const WeatherBoxContainer = styled.div`
  height: 20px;
  width: 85%;
  border-radius: 15px;
  background-color: white;
  margin: 0px 5px 5px 5px;
  padding: 20px;
  padding-top: 25px;
  padding-bottom: 25px;
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
  .weather-data {
    display: flex;
    align-items: center;

    .weather-img-wrap {
      margin-right: 10px; /* 이미지와 텍스트 사이 간격 조정 */
    }

    img {
      width: 50px; /* 이미지 너비 조정 */
      height: 50px; /* 이미지 높이 조정 */
      margin-right: 10px;
      margin-left: 10px;
    }
    h3 {
      font-weight: bold;
      font-size: 15px;
      margin-right: 10px;
      word-break: keep-all;
    }
  }
`;
