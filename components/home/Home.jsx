import styles from "./home.module.css";
import ModelViewer from "./ModelViewer";
const Home = () => {
  return (
    <div className={styles.container}>
      <ModelViewer scale="2.5" modelPath={"/nft_neymar.glb"} />
    </div>
  );
};

export default Home;
