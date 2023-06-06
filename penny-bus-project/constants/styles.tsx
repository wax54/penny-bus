export const styles = {
  page: {
    main: {
      width: "100vw",
      minHeight: "100vh",
      backgroundColor: "red",
      backgroundImage: "url(./img/penny-bus.jpg)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
      position: 'relative'
    },
    view: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)'
    },
    header: {
      textAlign: "center",
    },
    title: {
      display: "inline-block",
      textAlign: "center",
      padding: 20,
      border: "2px solid white",
      color: "white",
      borderRadius: 20,
      fontSize: '3rem',
    },
    subtitle: {
      textAlign: "center",
      color: "white",
    },
    nav: {
      main: {
        margin: "auto",
        fontSize: "1rem",
      },
      a: {
        color: 'white',
        margin: 10,
        borderColor: "white",
        borderWidth: "1px",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,

        borderStyle: "solid",
        borderRadius: 15,
        textDecoration: 'none',
      },
    },
  },
} as const;
