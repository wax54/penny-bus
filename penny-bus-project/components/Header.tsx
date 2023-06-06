import { Nav } from "./Nav";

export const Header = ({
  nav,
  styles,
}: {
  nav: readonly { href: string; text: string }[];
  styles: {
    header: any;
    title: any;
    subtitle: any;
    nav: { main: any; a: any };
  };
}) => {
  return (
    <div style={styles.header}>
      <h1 id="page-title" style={styles.title}>
        <em>The Penny Bus Project</em>
      </h1>
      <Nav nav={nav} styles={styles.nav} />
    </div>
  );
};
