import { CSSProperties } from "react";
import { brandColors } from "./colors";

export type StylesType = {
  page: {
    main: CSSProperties;
    view: CSSProperties;
    header: CSSProperties;
    sideBar?: CSSProperties;
    title: CSSProperties;
    subtitle: CSSProperties;
    nav: {
      main: CSSProperties;
      a: CSSProperties;
    };
  };
};
export const styles = {
  page: {
    main: {
      minWidth: "100vw",
      minHeight: "100vh",
      backgroundColor: brandColors.offWhite,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
      position: "relative",
    },
    view: {
      position: "absolute",
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px',
      backgroundColor: brandColors.offWhite,
    },
    header: {
      textAlign: "center",
    },
    title: {
      display: "inline-block",
      textAlign: "center",
      padding: '20px',
      border: "2px solid white",
      color: brandColors.white,
      borderRadius: '20px',
      fontSize: "3rem",
    },
    subtitle: {
      textAlign: "center",
      color: brandColors.white,
    },
    nav: {
      main: {
        margin: "auto",
        fontSize: "1rem",
        padding: 10,
      },
      a: {
        color: brandColors.white,
        marginLeft: '10px',
        marginRight: '10px',
        borderColor: brandColors.white,
        borderWidth: "1px",
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '5px',
        paddingBottom: '5px',

        borderStyle: "solid",
        borderRadius: '15px',
        textDecoration: "none",
      },
    },
  },
} as StylesType;
