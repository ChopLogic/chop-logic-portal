import Link from "next/link";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <div className={styles.header__brand}>
          <Link href="/">Chop Logic</Link>
        </div>
        <nav className={styles.header__nav}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
        </nav>
      </div>
    </header>
  );
}
