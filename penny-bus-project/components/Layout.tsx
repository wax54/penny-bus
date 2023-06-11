import { Nav } from "../constants/nav"
import { styles } from "../constants/styles"
import { Header } from "./Header"

export const Layout = (props: { children: JSX.Element | JSX.Element[] | undefined, nav: Nav }) => {
  return <div id="page" style={styles.page.main}>
  <div id="view" style={styles.page.view}>
      <Header nav={props.nav} styles={styles.page} />
      {props.children}
    </div>
  </div>
}