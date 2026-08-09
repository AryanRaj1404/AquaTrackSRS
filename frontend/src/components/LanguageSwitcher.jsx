import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  Check,
  ChevronDown,
} from "lucide-react";

import { SUPPORTED_LANGUAGES } from "../i18n";

function LanguageSwitcher({ variant = "light" }) {
  const { i18n } = useTranslation();

  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  const current =
    SUPPORTED_LANGUAGES.find(
      (language) =>
        language.code === i18n.resolvedLanguage
    ) ||
    SUPPORTED_LANGUAGES.find(
      (language) =>
        language.code === i18n.language
    ) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const isDark = variant === "dark";

  return (
    <div
      ref={containerRef}
      className="relative"
    >

      {/* ================= MOBILE ================= */}

      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          transition-all
          duration-300
          active:scale-95
          md:hidden

          ${
            isDark
              ? `
                border-white/20
                bg-white/10
                text-teal-100
                hover:bg-white/20
              `
              : `
                border-slate-200
                bg-white
                text-cyan-600
                shadow-[0_2px_8px_rgba(15,23,42,0.08)]
                hover:border-cyan-300
                hover:bg-cyan-50
                hover:text-teal-600
                hover:shadow-md
              `
          }
        `}
      >
        <Globe
          size={18}
          strokeWidth={2.2}
          className={`
            transition-transform
            duration-300
            ${open ? "rotate-12" : ""}
          `}
        />
      </button>

      {/* ================= DESKTOP ================= */}

      <button
  type="button"
  onClick={() =>
    setOpen((previous) => !previous)
  }
  aria-haspopup="listbox"
  aria-expanded={open}
  className={`
    hidden
    items-center
    gap-2.5
    rounded-full
    border
    px-4
    py-2.5
    text-sm
    font-semibold
    shadow-sm
    transition-all
    duration-300
    active:scale-95
    md:flex

    ${
      isDark
        ? `
          border-white/20
          bg-white/10
          text-white
          shadow-none
          backdrop-blur-md
          hover:border-white/30
          hover:bg-white/15
        `
        : `
          border-slate-200/80
          bg-white
          text-slate-700
          shadow-[0_4px_14px_rgba(15,23,42,0.07)]
          hover:-translate-y-0.5
          hover:border-cyan-200
          hover:bg-gradient-to-r
          hover:from-cyan-50
          hover:to-teal-50
          hover:text-teal-700
          hover:shadow-[0_8px_22px_rgba(6,182,212,0.12)]
        `
    }
  `}
>
  {/* Globe */}

  <span
    className={`
      flex
      h-7
      w-7
      items-center
      justify-center
      rounded-full
      transition-all
      duration-300

      ${
        isDark
          ? "bg-white/10 text-teal-100"
          : "bg-cyan-50 text-cyan-600"
      }
    `}
  >
    <Globe
      size={16}
      strokeWidth={2.2}
      className={`
        transition-transform
        duration-500
        ${open ? "rotate-180" : ""}
      `}
    />
  </span>

  {/* Current Language */}

  <span className="min-w-[58px] text-center">
    {current.nativeLabel}
  </span>

  {/* Divider */}

  <span
    className={`
      h-5
      w-px
      ${
        isDark
          ? "bg-white/15"
          : "bg-slate-200"
      }
    `}
  />

  {/* Chevron */}

  <ChevronDown
    size={15}
    strokeWidth={2}
    className={`
      transition-transform
      duration-300
      ${
        open
          ? "rotate-180"
          : ""
      }
    `}
  />
</button>

      {/* ================= LANGUAGE MENU ================= */}

      {open && (
        <div
          className="
            absolute
            right-0
            top-full
            z-[100]
            mt-3
            w-52
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-1.5
            shadow-[0_20px_50px_rgba(15,23,42,0.16)]
            animate-in
            fade-in
            slide-in-from-top-2
            duration-200
          "
        >

          <div
            className="
              px-3
              pb-2
              pt-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-slate-400
            "
          >
            Language
          </div>

          <ul
            role="listbox"
            className="space-y-0.5"
          >
            {SUPPORTED_LANGUAGES.map(
              (language) => (
                <li key={language.code}>

                  <button
                    type="button"
                    role="option"
                    aria-selected={
                      language.code ===
                      current.code
                    }
                    onClick={() =>
                      changeLanguage(
                        language.code
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-3
                      py-2.5
                      text-left
                      transition
                      hover:bg-cyan-50
                    "
                  >

                    <span className="flex flex-col leading-tight">

                      <span
                        className="
                          text-sm
                          font-semibold
                          text-slate-700
                        "
                      >
                        {language.nativeLabel}
                      </span>

                      <span
                        className="
                          mt-0.5
                          text-xs
                          text-slate-400
                        "
                      >
                        {language.label}
                      </span>

                    </span>

                    {language.code ===
                      current.code && (
                      <span
                        className="
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-full
                          bg-cyan-50
                        "
                      >
                        <Check
                          size={15}
                          className="text-teal-600"
                        />
                      </span>
                    )}

                  </button>

                </li>
              )
            )}
          </ul>

        </div>
      )}

    </div>
  );
}

export default LanguageSwitcher;