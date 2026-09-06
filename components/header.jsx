"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Navigation from "./navigation";
import { SceneAnimationPauseProvider } from "./scene-animation-context";
import styles from "./header.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const contentTransitionDuration = 500;

function RollingLabel({ label, onAnimationEnd }) {
  return (
    <span className={styles.labelMask} aria-hidden="true">
      <span className={styles.labelTrack} onAnimationEnd={onAnimationEnd}>
        <span className={styles.labelLine}>{label}</span>
        <span className={styles.labelLine}>{label}</span>
        <span className={styles.labelLine}>{label}</span>
      </span>
    </span>
  );
}

function HeaderLink({ href, label, onClick }) {
  const [motion, setMotion] = useState("");

  const className = [
    styles.headerLink,
    motion === "enter" ? styles.rollEnter : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      className={className}
      href={href}
      aria-label={label}
      onClick={onClick}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          setMotion("enter");
        }
      }}
    >
      <RollingLabel
        label={label}
        onAnimationEnd={() => {
          if (motion === "enter") {
            setMotion("");
          }
        }}
      />
    </Link>
  );
}

export default function Header({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [menuMotion, setMenuMotion] = useState("");
  const [headerMotion, setHeaderMotion] = useState("enter");
  const [contentMotion, setContentMotion] = useState("enter");
  const [pendingTransition, setPendingTransition] = useState(null);
  const [sceneAnimationPaused, setSceneAnimationPaused] = useState(false);
  const transitionTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  /**
   * The router has arrived where we asked it to go, so the transition is over.
   *
   * This is done during render rather than in a layout effect. React finishes
   * the re-render before the browser paints either way, which is the guarantee
   * the layout effect was there for — but doing it here means there is no
   * frame in which the new route is mounted while the old transition state is
   * still on screen. The condition clears `pendingTransition`, so it settles
   * after one extra pass.
   */
  if (pendingTransition && pathname === pendingTransition.href) {
    const { source } = pendingTransition;

    setPendingTransition(null);
    setContentMotion("enter");

    if (source === "navigation") {
      setNavOpen(false);
      setSceneAnimationPaused(false);
      setHeaderMotion("enter");
    } else {
      setHeaderMotion("idle");
    }
  }

  const startHeaderNavigation = (href) => {
    if (href === pathname || pendingTransition) {
      return;
    }

    setPendingTransition({ href, source: "header" });
    setContentMotion("exit");
    setHeaderMotion("idle");
    transitionTimer.current = window.setTimeout(() => {
      transitionTimer.current = null;
      router.push(href);
    }, contentTransitionDuration);
  };

  const handleHeaderNavigation = (event, href) => {
    event.preventDefault();
    startHeaderNavigation(href);
  };

  const menuClassName = [
    styles.menuButton,
    menuMotion === "enter" ? styles.rollEnter : "",
  ]
    .filter(Boolean)
    .join(" ");

  const headerClassName = [
    styles.header,
    navOpen ? styles.headerHidden : "",
    !navOpen && headerMotion === "enter"
      ? pathname === "/"
        ? styles.homeHeaderEntering
        : styles.headerEntering
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const contentClassName = [
    styles.content,
    contentMotion === "enter" && pathname !== "/" && pathname !== "/contact"
      ? styles.contentEntering
      : "",
    contentMotion === "exit"
      ? pathname === "/"
        ? styles.homeContentExiting
        : pathname === "/contact"
          ? styles.contactContentExiting
          : styles.contentExiting
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SceneAnimationPauseProvider paused={sceneAnimationPaused}>
      <header
        className={headerClassName}
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) {
            return;
          }
          if (headerMotion === "enter") {
            setHeaderMotion("idle");
          }
        }}
      >
        <button
          className={styles.mobileBrand}
          type="button"
          aria-label="Shanzhy home"
          onClick={() => {
            startHeaderNavigation("/");
          }}
        >
          Shanzhy
        </button>

        <nav className={styles.desktopNavigation} aria-label="Main navigation">
          {links.map((link) => (
            <HeaderLink
              href={link.href}
              label={link.label}
              key={link.href}
              onClick={(event) => {
                handleHeaderNavigation(event, link.href);
              }}
            />
          ))}
        </nav>

        <button
          className={menuClassName}
          type="button"
          aria-label="Open navigation"
          onClick={() => {
            if (pendingTransition) {
              return;
            }
            setPendingTransition(null);
            setSceneAnimationPaused(false);
            setHeaderMotion("idle");
            setContentMotion("idle");
            setNavOpen(true);
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") {
              setMenuMotion("enter");
            }
          }}
        >
          <RollingLabel
            label="Menu"
            onAnimationEnd={() => {
              if (menuMotion === "enter") {
                setMenuMotion("");
              }
            }}
          />
        </button>
      </header>

      <div
        className={contentClassName}
        data-content-motion={contentMotion}
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) {
            return;
          }

          if (contentMotion === "enter") {
            setContentMotion("idle");
          }
        }}
      >
        {children}
      </div>

      <Navigation
        open={navOpen}
        onClose={() => {
          setPendingTransition(null);
          setSceneAnimationPaused(false);
          setNavOpen(false);
          setHeaderMotion("idle");
          setContentMotion("idle");
        }}
        onNavigate={(href) => {
          setSceneAnimationPaused(false);
          setPendingTransition({ href, source: "navigation" });
          router.push(href);
        }}
        onCovered={() => {
          setSceneAnimationPaused(true);
        }}
        onReveal={() => {
          setSceneAnimationPaused(false);
        }}
      />
    </SceneAnimationPauseProvider>
  );
}
