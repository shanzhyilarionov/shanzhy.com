"use client";

import dynamic from "next/dynamic";
import styles from "./page.module.css";

const Tesseract = dynamic(() => import("../components/tesseract"), {
  ssr: false,
});

/* The title and the button on this page belong to the shell's chrome, which
   outlives the route; all that is left here is the object itself. */
export default function Page() {
  return (
    <main className={styles.home}>
      <div className={styles.tesseractLayer}>
        <Tesseract />
      </div>
    </main>
  );
}
