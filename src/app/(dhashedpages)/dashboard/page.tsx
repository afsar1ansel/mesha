// import Image from "next/image";
import styles from "./page.module.css";

import { TbDeviceAnalytics } from "react-icons/tb";
import { RiUser3Line } from "react-icons/ri";
import { IoMdPaper } from "react-icons/io";
import { AiOutlineCloudUpload } from "react-icons/ai";




export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.hello}>
        <h3>👋 Hello, Amogh</h3>
        <p>Here is all your analytics overview</p>
      </div>

      <div className={styles.statesContainer}>
        <div className={styles.stateBox}>
          <div className={styles.stateText}>
            <p>TOTAL DEVICES REGISTERED</p>
            <h2>1990</h2>
            <p className={styles.measure}>↑ 3.5% Increase</p>
          </div>
          <div className={styles.stateIcon}>
            <TbDeviceAnalytics />
          </div>
        </div>

        <div className={styles.stateBox}>
          <div className={styles.stateText}>
            <p>ACTIVE USERS</p>
            <h2>90</h2>
            <p className={styles.measure} style={{ color: "red" }}>↑ 3.5% Increase</p>
          </div>
          <div className={styles.stateIcon}>
            <RiUser3Line />
          </div>
        </div>

        <div className={styles.stateBox}>
          <div className={styles.stateText}>
            <p>REPORTS GENERATED</p>
            <h2>90</h2>
            <p className={styles.measure}>↑ 3.5% Increase</p>
          </div>
          <div className={styles.stateIcon}>
            <IoMdPaper />
          </div>
        </div>

        <div className={styles.stateBox}>
          <div className={styles.stateText}>
            <p>REPORTS UPLOADED TODAY</p>
            <h2>9</h2>
            <p className={styles.measure}>↑ 3.5% Increase</p>
          </div>
          <div className={styles.stateIcon}>
            <AiOutlineCloudUpload />
          </div>
        </div>
      </div>

      
    </div>
  );
}
