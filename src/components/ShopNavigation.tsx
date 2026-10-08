import { useEffect, useRef, useState } from "react";
import { ArrowUpLeft, ChevronDown, Coffee } from "lucide-react";
import { Product, money } from "../data";
const collections = [
  { name: "قهوه", note: "دانه و عطرِ شروع روز", image: "beans.jpg" },
  { name: "شکلات", note: "یک تکه خوشحالی", image: "chocolate.jpg" },
  { name: "قهوه‌ساز", note: "برای فنجان بعدی", image: "machine.jpg" },
  { name: "ماگ و تجهیزات", note: "همراه‌های هر روز", image: "mug.jpg" },
];
export default function ShopNavigation({
  onCategory,
  onGuide,
  onProduct,
  featured,
}: {
  onCategory: (category: string) => void;
  onGuide: () => void;
  onProduct: (p: Product) => void;
  featured?: Product;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div
      ref={root}
      className="shop-navigation"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className="shop-nav-trigger"
        aria-expanded={open}
        aria-controls="shop-mega"
        onClick={() => setOpen(!open)}
      >
        فروشگاه <ChevronDown size={15} />
      </button>
      {open && (
        <div id="shop-mega" className="shop-mega">
          <div className="mega-heading">
            <strong>از قفسه‌های درصد</strong>
            <a
              href="#shop"
              onClick={() => {
                setOpen(false);
                onCategory("همه محصولات");
              }}
            >
              همه محصولات <ArrowUpLeft size={17} />
            </a>
          </div>
          <div className="mega-content">
            <div className="mega-categories">
              {collections.map((c) => (
                <a
                  href="#shop"
                  key={c.name}
                  onClick={() => {
                    setOpen(false);
                    onCategory(c.name);
                  }}
                >
                  <img src={"./images/" + c.image} alt="" />
                  <strong>{c.name}</strong>
                  <small>{c.note}</small>
                </a>
              ))}
            </div>
            {featured && (
              <button
                className="mega-featured"
                onClick={() => {
                  setOpen(false);
                  onProduct(featured);
                }}
              >
                <img src={featured.image} alt="" />
                <span>
                  انتخاب درصد<strong>{featured.name}</strong>
                  <small>{money(featured.price)}</small>
                </span>
                <ArrowUpLeft size={19} />
              </button>
            )}
          </div>
          <button
            className="mega-guide"
            onClick={() => {
              setOpen(false);
              onGuide();
            }}
          >
            <Coffee size={21} />
            <span>
              قهوه مناسب خودت را پیدا کن
              <small>دو سؤال کوتاه؛ یک پیشنهاد برای فنجان شما</small>
            </span>
            <ArrowUpLeft size={21} />
          </button>
        </div>
      )}
    </div>
  );
}
