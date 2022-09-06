import styles from "./home.module.css";
import ModelViewer from "../3d-model-component/ModelViewer";
const Home = () => {
  return (
    <div className={styles.container}>
      <ModelViewer scale="2.3" modelPath={"/nft_neymar.glb"} />
    </div>
  );
};

export default Home;
