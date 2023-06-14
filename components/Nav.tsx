export const Nav = ({
  nav,
  styles,
}: {
  nav: readonly { href: string; text: string }[];
  styles: { main: any; a: any };
}) => {
  return (
    <div id="nav" style={styles.main}>
      {nav.map((item) => (
        <a href={item.href} style={styles.a}>
          {item.text}
        </a>
      ))}
    </div>
  );
};
