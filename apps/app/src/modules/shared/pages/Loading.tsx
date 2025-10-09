import styles from "./Loading.module.css";

/* COMPONENT */
export const LoadingPage = () => {
  return (
    <div className="h-screen grid place-content-center">
      <div className={styles.container}></div>
    </div>
  );
};
