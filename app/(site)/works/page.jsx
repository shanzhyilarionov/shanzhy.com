"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./works.module.css";

const projects = [
  {
    title: "Genesis",
    image: "/images/genesis.png",
    duration: "0.8s",
  },
  {
    title: "shanzhy.io",
    image: "/images/shanzhy.png",
    duration: "0.5s",
  },
  {
    title: "Commissioning Workspace",
    image: "/images/commissioning-workspace.png",
    duration: "1s",
  },
];

export default function Works() {
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      setResizing(true);
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => setResizing(false), 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <main
      className={styles.page}
      onPointerMove={(event) => {
        if (!hoverEnabled && event.pointerType === "mouse") {
          setHoverEnabled(true);
        }
      }}
    >
      <section
        className={[
          styles.projects,
          hoverEnabled ? styles.hoverEnabled : "",
          resizing ? styles.resizing : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Selected projects"
      >
        {projects.map((project) => (
          <article
            className={styles.project}
            style={{ "--reveal-duration": project.duration }}
            key={project.title}
          >
            <div className={styles.reveal}>
              <div className={styles.revealContent}>
                <div className={styles.imageFrame}>
                  <Image
                    className={styles.image}
                    src={project.image}
                    alt={`${project.title} project preview`}
                    fill
                    sizes="(max-width: 768px) 22vw, 29rem"
                    priority
                  />
                </div>
              </div>
            </div>

            <h2 className={styles.title}>{project.title}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
