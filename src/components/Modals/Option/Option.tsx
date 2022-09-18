import styles from "./Option.module.scss";
interface OptionData {
  info: string;
  index: number;
  selected: number;
  setSelected: (i: number) => void;
}
const Option = ({ info, index, selected, setSelected }: OptionData) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.choose} onClick={() => setSelected(index)}>
        {index === selected ? (
          <div className={styles.thisOne}></div>
        ) : (
          <div className={styles.otherOne}></div>
        )}
      </div>
      <div className={styles.info}>{info}</div>
    </div>
  );
};

export { Option };
