import Header from "../header-component/Header";
import styles from "./layout.module.css";
const layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.layout_container}>{children}</div>
    </>
  );
};

export default layout;
