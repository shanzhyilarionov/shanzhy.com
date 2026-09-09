"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useHoverEnabled } from "../../../components/hover-boundary";
import styles from "./works.module.css";

const projects = [
  {
    title: "Genesis",
    image: "/images/genesis.png",
    aspectRatio: 2880 / 1800,
    duration: "0.8s",
  },
  {
    title: "shanzhy.io",
    image: "/images/shanzhy.png",
    aspectRatio: 1438 / 899,
    duration: "0.5s",
  },
  {
    title: "Commissioning Workspace",
    image: "/images/commissioning-workspace.png",
    aspectRatio: 2880 / 1800,
    duration: "1s",
  },
];

export default function Works() {
  const hoverEnabled = useHoverEnabled();
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
    <main className={styles.page}>
      <section className={styles.content} aria-labelledby="works-heading">
        <h1 className={styles.heading} id="works-heading">
          <span className={styles.headingLabel}>Things I’ve built.</span>
        </h1>

        <div
          className={[
            styles.projects,
            hoverEnabled ? styles.hoverEnabled : "",
            resizing ? styles.resizing : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {projects.map((project) => (
            <article
              className={styles.project}
              style={{
                "--reveal-duration": project.duration,
                "--image-ratio": project.aspectRatio,
              }}
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
                      sizes="18rem"
                      priority
                    />
                  </div>
                </div>
              </div>

              <h2 className={styles.title}>{project.title}</h2>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
