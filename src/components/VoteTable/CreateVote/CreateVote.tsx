import styles from "./CreateVote.module.scss";
import { Button } from "ui/Button/Button";
const CreateVote = () => {
  return (
    <div className={styles.wrapper}>
      <Button
        className={styles.swap}
        color={"green"}
        width={"140px"}
        height="45px"
        fontWeight="fw600"
        onClick={() => {}}
      >
        Create Vote
      </Button>
    </div>
  );
};

export { CreateVote };
