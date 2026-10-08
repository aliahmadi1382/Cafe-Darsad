import { useEffect, useId, useRef } from "react";
import { ArrowDown, ArrowUpLeft } from "lucide-react";
import "./ScrollCoffee.css";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
export default function ScrollCoffee() {
  const section = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const clip = "cup-" + useId().replace(/:/g, "");
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = section.current;
      const stage = scene.current;
      if (!root || !stage) return;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const rect = root.getBoundingClientRect();
      const travel = Math.max(1, root.offsetHeight - stage.offsetHeight);
      const progress = preference.matches
        ? 1
        : clamp((top - rect.top) / travel);
      const fill = clamp(progress / 0.78);
      const reveal = clamp((progress - 0.72) / 0.28);
      stage.dataset.steaming = String(
        fill > 0.4 && rect.bottom > top && rect.top < window.innerHeight,
      );
      stage.style.setProperty("--coffee-fill", String(fill));
      stage.style.setProperty("--name-reveal", String(reveal));
      stage.style.setProperty(
        "--steam-reveal",
        String(clamp((fill - 0.4) / 0.4)),
      );
      stage.style.setProperty("--scroll-progress", String(progress));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, []);
  return (
    <section
      ref={section}
      id="coffee-ritual"
      className="scroll-coffee"
      aria-label="یک فنجان در درصد"
    >
      <div ref={scene} className="pour-scene">
        <div className="pour-intro">
          <span>از اولین قطره، تا یک حال خوب.</span>
          <a href="#shop">
            رفتن به محصولات <ArrowUpLeft size={16} />
          </a>
        </div>
        <div className="pour-art" aria-hidden="true">
          <svg viewBox="0 0 600 430" fill="none">
            <defs>
              <clipPath id={clip}>
                <path d="M164 137H426L409 279C405 318 380 336 295 336C211 336 185 318 181 279Z" />
              </clipPath>
              <linearGradient
                id={clip + "-coffee"}
                x1="164"
                y1="140"
                x2="410"
                y2="330"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#98623b" />
                <stop offset="1" stopColor="#39231b" />
              </linearGradient>
            </defs>
            <ellipse
              cx="302"
              cy="367"
              rx="196"
              ry="24"
              fill="#c1a174"
              fillOpacity=".04"
              stroke="#a68a67"
              strokeOpacity=".4"
            />
            <path
              d="M427 165C528 148 536 263 420 276"
              stroke="#c9b491"
              strokeWidth="14"
              strokeOpacity=".7"
            />
            <path
              d="M430 184C498 173 499 248 425 255"
              stroke="#c9b491"
              strokeWidth="2"
              strokeOpacity=".4"
            />
            <path
              d="M157 130H433L415 281C410 326 378 343 295 343C211 343 179 326 174 281Z"
              fill="#e9dcca"
              fillOpacity=".04"
              stroke="#dcc8a9"
              strokeWidth="2"
            />
            <g clipPath={"url(#" + clip + ")"}>
              <g className="cup-liquid">
                <path
                  d="M140 137H450V355H140Z"
                  fill={"url(#" + clip + "-coffee)"}
                />
                <ellipse cx="295" cy="137" rx="143" ry="17" fill="#b98b53" />
                <ellipse cx="295" cy="137" rx="130" ry="11" fill="#6e4328" />
                <path
                  d="M190 136C233 129 266 129 297 132"
                  stroke="#dcb981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </g>
            <ellipse
              cx="295"
              cy="132"
              rx="138"
              ry="18"
              stroke="#e3cfb0"
              strokeWidth="2"
            />
            <path
              d="M187 162L198 273C201 295 212 306 232 313"
              stroke="#f5e6cb"
              strokeOpacity=".25"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <g
              className="cup-steam"
              stroke="#c9b491"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path className="steam-one" d="M256 107C236 81 276 63 256 33" />
              <path className="steam-two" d="M296 99C276 72 316 50 296 16" />
              <path className="steam-three" d="M336 107C317 85 354 65 335 38" />
            </g>
          </svg>
        </div>
        <div className="pour-brand">
          <span className="pour-percent">٪</span>
          <h2>کافه درصد</h2>
          <p>درصدی از روزت را برای خودت نگه دار.</p>
        </div>
        <div className="pour-foot">
          <span className="pour-hint">
            <ArrowDown size={16} /> با اسکرول، فنجانت را پر کن
          </span>
          <span className="pour-meter" aria-hidden="true">
            <i />
          </span>
          <span>یک فنجان نزدیک‌تر.</span>
        </div>
      </div>
    </section>
  );
}
