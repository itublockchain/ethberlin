import styles from "./Opening.module.scss";
import BACKGROUND from "assets/background.png";
import TEXT from "assets/text.png";
const Opening = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.background}>
        {/* <img src={BACKGROUND}></img> */}
      </div>
      <div className={styles.text}>
        <img src={TEXT}></img>
      </div>
    </div>
  );
};

export { Opening };
