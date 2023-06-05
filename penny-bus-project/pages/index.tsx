import { GetStaticProps, InferGetStaticPropsType } from "next";
const styles = {
  page: {
    main: {
      width: "100vw",
      height: "100vh",
      backgroundColor: "red",
      backgroundImage: "url(./img/penny-bus.jpg)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
    },
    title: {
      textAlign: "center",
      color: "white",
    },
    subtitle: {
      textAlign: "center",
      color: "white",
    },
  },

  nav: {
    main: {
      width: "300px",
      margin: "auto",
      fontSize: "4rem",
      'a': {
        backgroundColor: 'red',
      }
    },
    a: {
      padding: "4px",
      borderColor: "white",
      borderWidth: "2px",
      borderStyle: "solid",
    },
  },
} as const;
export default function Home({
  page,
}: InferGetStaticPropsType<GetStaticProps>) {
  return (
    <div id="page" style={styles.page.main}>
      <h1 id="page-title" style={styles.page.title}>The Penny Bus</h1>
      <h2 id="page-subtitle" style={styles.page.subtitle}>Our Trip around the town!</h2>
      <div id="nav" style={styles.nav.main}>
        <a href="blog" style={styles.nav.a}> Blog </a>
      </div>
    </div>
  );
}

export function getStaticProps() {
  return { props: { page: { a: "hello" } } };
}
