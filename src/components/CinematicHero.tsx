import { useState } from "react";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
const worlds = [
  {
    name: "قهوه",
    image: "darsad-editorial.webp",
    caption: "قهوه و شکلات؛ یک مکث دل‌چسب",
    title: (
      <>
        درصدی
        <br />
        برای خودت.
      </>
    ),
    text: "یک فنجان خوب، بهانه‌ای برای آرام‌تر شدن روز. قهوه‌ات را پیدا کن؛ بقیه‌اش را به عطرش بسپار.",
  },
  {
    name: "شکلات",
    image: "chocolate.jpg",
    caption: "لذت، گاهی فقط یک تکه است",
    title: (
      <>
        کمی تلخ.
        <br />
        خیلی دل‌چسب.
      </>
    ),
    text: "از شکلات تلخ تا هدیه‌های کوچک؛ طعم‌هایی برای شریک شدن، یا نگه داشتن برای خودت.",
  },
  {
    name: "ماگ و تجهیزات",
    image: "machine.jpg",
    caption: "آیین کوچکِ هر صبح",
    title: (
      <>
        فنجان خوب،
        <br />
        از اینجا.
      </>
    ),
    text: "قهوه‌ساز، ماگ و همراه‌های دم‌آوری؛ برای ساختن گوشه‌ای که هر صبح دوستش داشته باشی.",
  },
];
export default function CinematicHero({
  onCategory,
  onMenu,
}: {
  onCategory: (c: string) => void;
  onMenu: () => void;
}) {
  const [world, setWorld] = useState(0);
  const item = worlds[world];
  return (
    <section className="atelier-hero">
      <div className="atelier-hero-copy">
        <span className="hero-location">
          تهران، حوالی پارک پلیس <span aria-hidden="true">—</span> کافه درصد
        </span>
        <h1>{item.title}</h1>
        <p>{item.text}</p>
        <div className="atelier-hero-actions">
          <a
            className="button copper"
            href="#shop"
            onClick={() => onCategory(item.name)}
          >
            کشف {world === 2 ? "تجهیزات" : item.name}
            <ArrowLeft size={19} />
          </a>
          <button className="hero-menu-link" onClick={onMenu}>
            منوی کافه <ArrowUpLeft size={19} />
          </button>
        </div>
        <div className="world-selector" aria-label="دنیای درصد">
          {worlds.map((w, i) => (
            <button
              key={w.name}
              aria-pressed={world === i}
              onClick={() => setWorld(i)}
            >
              {w.name}
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
      <div className="atelier-hero-visual">
        <img
          key={item.image}
          className="atelier-hero-image"
          src={"./images/" + item.image}
          alt={
            item.name === "قهوه"
              ? "تصویر اختصاصی فنجان قهوه، شکلات تلخ و دانه‌های قهوه"
              : item.name === "شکلات"
                ? "بافت تکه‌های شکلات تلخ"
                : "جزئیات یک دستگاه اسپرسوساز"
          }
        />
        <span className="hero-photo-caption">{item.caption}</span>
        <div className="hero-seal" aria-hidden="true">
          <span>درصد</span>
          <b>٪</b>
          <small>یک فنجان نزدیک‌تر</small>
        </div>
      </div>
      <div className="atelier-hero-foot">
        <span>قهوه، شکلات، و لذتِ مکث کردن.</span>
        <a href="#collections">
          دنیای درصد را ببین <ArrowLeft size={16} />
        </a>
      </div>
    </section>
  );
}
