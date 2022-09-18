import styles from "./Navbar.module.scss";
import { Button } from "ui/Button/Button";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { useTheme } from "hooks/useTheme";
import LOGO from "assets/logo.png";
// import LOGO from "assets/logo-for-light.png";
import { useAccount } from "hooks/useAccount";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useEffect } from "react";
import { parseAddress } from "utils/parseAddress";

const Navbar = () => {
  const { toggleTheme, theme } = useTheme();
  const { connectAccount } = useAccount();
  const account = useSelector((state: RootState) => state.account.account);
  useEffect(() => {
    if (window.ethereum.selectedAddress !== null) {
      connectAccount();
    }
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.app}>
          <div
            className={styles.logo}
            onClick={() => {
              console.log(account);
            }}
          >
            <img src={LOGO}></img>
          </div>
          <div className={styles.buttons}>
            {/* <div
              className={styles.themeChanger}
              onClick={toggleTheme}
              style={
                theme === "light" ? { color: "#363853" } : { color: "white" }
              }
            >
              <div className={styles.themeChanger}>
                {theme === "dark" ? (
                  <IoMdMoon size={22} />
                ) : (
                  <IoMdSunny size={22} />
                )}
              </div>
            </div> */}
            <Button
              className={styles.swap}
              color={"lightGreen"}
              width={"170px"}
              height="45px"
              fontWeight="fw600"
              onClick={() => {
                connectAccount();
              }}
            >
              {account ? parseAddress(account) : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export { Navbar };
