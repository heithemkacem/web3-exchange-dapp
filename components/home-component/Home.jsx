import styles from "./home.module.css";
import Header from "../header-component/Header";
import GlitchText from "../glitch-text-component/GlitchText";
const Home = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>
          <GlitchText>Exchange Your Crypto </GlitchText>
        </h1>
      </div>
    </>
  );
};

export default Home;
