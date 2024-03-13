// theme.ts
import "styled-components";

// styled-components의 DefaultTheme 인터페이스 확장
declare module "styled-components" {
  export interface DefaultTheme {
    main: string;
    sub: string;
    maintext: string;
    subtext: string;
    point: string;
  }
}
// 테마 객체 정의
export const theme = {
  light: {
    main: "#566CF0",
    sub: "#FFC65C",
    maintext: "#000000",
    subtext: "#FFFFFF",
    point: "#DB5DD4",
  },
  dark: {
    main: "#566CF0",
    sub: "#FFC65C",
    maintext: "#000000",
    subtext: "#FFFFFF",
    point: "#DB5DD4",
  },
};
