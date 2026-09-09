"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHoverEnabled } from "../../../components/hover-boundary";
import { projects } from "./projects";
import styles from "./works.module.css";

const EXIT_STEP_MS = 500;

export default function Works() {
  const router = useRouter();
  const hoverEnabled = useHoverEnabled();
  const [resizing, setResizing] = useState(false);
  const [transition, setTransition] = useState(null);

  useEffect(() => {
    if (!transition) return;

    const timer = window.setTimeout(() => {
      if (transition.phase === "settling") {
        setTransition({ ...transition, phase: "exiting" });
      } else {
        router.push(transition.href);
      }
    }, EXIT_STEP_MS);

    return () => window.clearTimeout(timer);
  }, [transition, router]);

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

  const openProject = (event, slug) => {
    if (
      !transition &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    event.preventDefault();
    setTransition((current) =>
      current ?? { href: `/works/${slug}`, phase: "settling" },
    );
  };

  return (
    <main
      className={[
        styles.page,
        transition?.phase === "exiting" ? styles.exiting : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--exit-duration": `${EXIT_STEP_MS}ms` }}
    >
      <section className={styles.content} aria-labelledby="works-heading">
        <h1 className={styles.heading} id="works-heading">
          <span className={styles.headingLabel}>Things I’ve built.</span>
        </h1>

        <div
          className={[
            styles.projects,
            hoverEnabled && !transition ? styles.hoverEnabled : "",
            transition ? styles.departing : "",
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
              key={project.slug}
            >
              <Link
                className={styles.reveal}
                href={`/works/${project.slug}`}
                aria-label={project.title}
                onNavigate={(event) => openProject(event, project.slug)}
              >
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
              </Link>

              <h2 className={styles.title}>{project.title}</h2>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
