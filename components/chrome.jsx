import styles from "./chrome.module.css";

/** The wordmark, on every page but home. */
export function Brand() {
  return <span className={styles.brand}>© Shanzhy</span>;
}

/**
 * Home's version of the wordmark. Each letter slides in from behind its own
 * mask, half a second in, so the word lands with the tesseract.
 */
export function HomeTitle() {
  return (
    <h1 className={styles.title} aria-label="Shanzhy">
      {"Shanzhy".split("").map((letter, index) => (
        <span className={styles.letterMask} aria-hidden="true" key={index}>
          <span className={styles.letter}>{letter}</span>
        </span>
      ))}
    </h1>
  );
}

/**
 * The pair of things pinned to the sides of the screen: `left` on the 1/20
 * line, `right` on the 19/20 line, both centred vertically.
 *
 * The row spans the viewport but is inert, so it never takes a pointer from
 * the page behind it — only the controls inside it do.
 */
export default function Chrome({ left, right, className }) {
  return (
    <div className={[styles.chrome, className].filter(Boolean).join(" ")}>
      <div className={styles.slot}>{left}</div>
      <div className={styles.slot}>{right}</div>
    </div>
  );
}
