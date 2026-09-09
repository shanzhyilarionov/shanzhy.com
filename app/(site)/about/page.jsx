"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./about.module.css";

const heading = "Bridging technical structure and human needs.";

const paragraphs = [
  "Hello! My name is Shanzhy Ilarionov. I am currently a Computing Science student at the University of Alberta and an independent developer focused on software engineering and user experience design.",
  "I turn complex requirements into maintainable systems and intuitive interfaces, with strengths in frontend architecture, interaction design, and workflow optimization. I believe every feature should serve a clear purpose, and I aim to balance functionality, clarity, and aesthetics while reducing unnecessary complexity.",
  "I am open to collaborations, freelance work, and other opportunities to build meaningful products.",
];

const textBlocks = [heading, ...paragraphs];

export default function About() {
  const contentRef = useRef(null);
  const blockRefs = useRef([]);
  const [lines, setLines] = useState([]);
  const [entered, setEntered] = useState(false);
  const lineCount = lines.reduce((count, block) => count + block.length, 0);
  let lineIndex = 0;

  useLayoutEffect(() => {
    if (entered) return;
    let disposed = false;

    const updateLines = () => {
      if (disposed) return;

      const nextLines = blockRefs.current.map((block) => {
        const bounds = block.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(block.firstElementChild);
        const rects = Array.from(range.getClientRects()).filter(
          (rect) => rect.width > 0 && rect.height > 0,
        );

        // Read the browser's line positions without inserting any line breaks.
        return rects.map((rect, index) => ({
          top:
            index === 0
              ? Math.min(-1, rect.top - bounds.top - 1)
              : (rects[index - 1].bottom + rect.top) / 2 - bounds.top,
          bottom:
            index === rects.length - 1
              ? Math.min(-1, bounds.bottom - rect.bottom - 1)
              : bounds.bottom - (rect.bottom + rects[index + 1].top) / 2,
        }));
      });

      setLines((current) =>
        JSON.stringify(current) === JSON.stringify(nextLines)
          ? current
          : nextLines,
      );
    };

    const observer = new ResizeObserver(updateLines);
    observer.observe(contentRef.current);
    document.fonts.ready.then(updateLines);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [entered]);

  return (
    <main className={styles.page}>
      <section
        className={styles.content}
        aria-label="About Shanzhy Ilarionov"
        ref={contentRef}
        data-entered={entered}
        onAnimationEnd={() => setEntered(true)}
      >
        {textBlocks.map((text, blockIndex) => {
          const Tag = blockIndex === 0 ? "h1" : "p";

          return (
            <Tag
              className={blockIndex === 0 ? styles.heading : styles.paragraph}
              ref={(element) => {
                blockRefs.current[blockIndex] = element;
              }}
              key={blockIndex}
            >
              <span className={styles.source}>{text}</span>
              {!entered &&
                lines[blockIndex]?.map((line, index) => {
                  // The heading and body share one sequence ending at 500ms.
                  const duration =
                    200 + (300 * lineIndex++) / Math.max(1, lineCount - 1);

                  return (
                    <span
                      className={styles.line}
                      aria-hidden="true"
                      style={{
                        "--clip-top": `${line.top}px`,
                        "--clip-bottom": `${line.bottom}px`,
                        "--duration": `${duration}ms`,
                        "--delay": `${500 - duration}ms`,
                      }}
                      key={index}
                    >
                      {text}
                    </span>
                  );
                })}
            </Tag>
          );
        })}
      </section>
    </main>
  );
}
