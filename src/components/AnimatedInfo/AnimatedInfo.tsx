import styles from "./AnimatedInfo.module.scss";
import GIF from "assets/ether.gif";

const AnimatedInfo = () => {
  return (
    <div className={styles.wrapper}>
      <img
        className={styles.ether}
        src={GIF}
        alt="This is an animated gif image, but it does not move"
      />
      <div className={styles.marquee}>
        <ul className={styles.list}>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
        </ul>
      </div>
      <div className={styles.marquee}>
        <ul className={styles.list}>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
          <li>&nbsp;VQt!ng!&nbsp; </li>
          <li>&nbsp;Dumbra!&nbsp; </li>
          <li>&nbsp;Pr!v?cy!&nbsp; </li>
        </ul>
      </div>
      {/* <div className={styles.text1}>
        &nbsp;Testing Phase!&nbsp; &nbsp;Testing Phase!&nbsp; &nbsp;Testing
        Phase!&nbsp; &nbsp;Testing Phase!&nbsp; &nbsp;Testing Phase!&nbsp;
        &nbsp;Testing Phase!&nbsp; &nbsp;Testing Phase!&nbsp; &nbsp;Testing
        Phase!&nbsp; &nbsp;Testing Phase!&nbsp; &nbsp;Testing Phase!&nbsp;
        &nbsp;Testing Phase!&nbsp; &nbsp;Testing Phase!&nbsp; &nbsp;Testing
        Phase!&nbsp; &nbsp;Testing Phase!&nbsp; &nbsp;Testing Phase!&nbsp;
        &nbsp;Testing Phase!&nbsp; &nbsp;Testing Phase!&nbsp;
      </div> */}
    </div>
  );
};

export { AnimatedInfo };
