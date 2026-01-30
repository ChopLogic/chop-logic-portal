import styles from "./Footer.module.scss";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__copyright}>
        © {year} Chop Logic. All rights reserved.
      </div>
    </footer>
  );
}
