import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Search,
  X,
  Plus,
  Minus,
  Coffee,
  MapPin,
  ArrowUpLeft,
  SlidersHorizontal,
  Check,
  Menu as MenuIcon,
  Star,
} from "lucide-react";
import { products as initial, categories, menu, money, Product } from "./data";
import CafeMenu from "./components/CafeMenu";
import CoffeeFinder from "./components/CoffeeFinder";
import ShopNavigation from "./components/ShopNavigation";
function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function useSaved<T>(key: string, initial: T) {
  const [value, set] = useState<T>(() => read(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, set] as const;
}
export default function App() {
  const [products, setProducts] = useSaved<Product[]>(
    "darsad-products",
    initial,
  );
  const [favorites, setFavorites] = useSaved<number[]>("darsad-favorites", []);
  const [cart, setCart] = useSaved<Record<number, number>>("darsad-cart", {});
  const [reviews, setReviews] = useSaved<
    { productId: number; name: string; text: string; rating: number }[]
  >("darsad-reviews-v2", []);
  const [panel, setPanel] = useState<
    "cart" | "favorites" | "menu" | "admin" | "product" | "finder" | null
  >(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [category, setCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [toast, setToast] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [mobile, setMobile] = useState(false);
  const [rating, setRating] = useState(5);
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (panel) dialog.current?.showModal();
    else dialog.current?.close();
  }, [panel]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const notify = (message: string) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3000);
  };
  const add = (id: number) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    notify("به سبد خرید اضافه شد");
  };
  const favorite = (id: number) =>
    setFavorites((f) =>
      f.includes(id) ? f.filter((x) => x !== id) : [...f, id],
    );
  const total = products.reduce((s, p) => s + p.price * (cart[p.id] || 0), 0);
  const count = Object.values(cart).reduce((s, n) => s + n, 0);
  const visible = products
    .filter(
      (p) =>
        (category === categories[0] || p.category === category) &&
        `${p.name} ${p.note}`.includes(query),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : 0,
    );
  const openProduct = (p: Product) => {
    setSelected(p);
    setPanel("product");
  };
  const card = (p: Product) => (
    <article className="product" key={p.id}>
      <div className="product-photo">
        <button
          className={
            "favorite icon " + (favorites.includes(p.id) ? "active" : "")
          }
          aria-label={"علاقه‌مندی " + p.name}
          aria-pressed={favorites.includes(p.id)}
          onClick={() => favorite(p.id)}
        >
          <Heart size={19} />
        </button>
        {p.tag && <span className="tag">{p.tag}</span>}
        <button
          className="image-button"
          onClick={() => openProduct(p)}
          aria-label={"جزئیات " + p.name}
        >
          <img loading="lazy" src={p.image} alt={p.name} />
        </button>
      </div>
      <span className="product-category">{p.category}</span>
      <button className="product-title" onClick={() => openProduct(p)}>
        {p.name}
      </button>
      <p>{p.note}</p>
      <div className="product-bottom">
        <strong>{money(p.price)}</strong>
        <button
          className="add icon"
          aria-label={"افزودن " + p.name}
          onClick={() => add(p.id)}
        >
          <Plus size={19} />
        </button>
      </div>
    </article>
  );
  return (
    <>
      <div className="announcement">
        از اولین جرعه، تا آخرین تکه شکلات؛ خوش آمدید به درصد{" "}
        <span>نسخه نمایشی</span>
      </div>
      <header>
        <a className="brand" href="#" aria-label="درصد، صفحه اصلی">
          <span className="brand-symbol">٪</span>
          <span>
            درصد<small>قهوه و لحظه‌های خوش</small>
          </span>
        </a>
        <nav className={mobile ? "open" : ""} aria-label="ناوبری اصلی">
          <ShopNavigation
            featured={products.find((p) => p.id === 1)}
            onProduct={(p) => {
              setMobile(false);
              openProduct(p);
            }}
            onCategory={(c) => {
              setCategory(c);
              setQuery("");
              setMobile(false);
            }}
            onGuide={() => {
              setMobile(false);
              setPanel("finder");
            }}
          />
          <button
            onClick={() => {
              setMobile(false);
              setPanel("finder");
            }}
          >
            راهنمای قهوه
          </button>
          <button
            onClick={() => {
              setPanel("menu");
              setMobile(false);
            }}
          >
            منوی کافه
          </button>
          <a href="#story" onClick={() => setMobile(false)}>
            داستان درصد
          </a>
          <a href="#visit" onClick={() => setMobile(false)}>
            به ما سر بزنید
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="icon"
            aria-label="جست‌وجوی محصولات"
            onClick={() => {
              document.getElementById("shop")?.scrollIntoView();
              document.getElementById("search")?.focus();
            }}
          >
            <Search size={21} />
          </button>
          <button
            className="icon"
            aria-label="نمایش علاقه‌مندی‌ها"
            onClick={() => setPanel("favorites")}
          >
            <Heart size={21} />
          </button>
          <button
            className="icon bag"
            aria-label="نمایش سبد خرید"
            onClick={() => setPanel("cart")}
          >
            <ShoppingBag size={21} />
            {count > 0 && (
              <span>{new Intl.NumberFormat("fa-IR").format(count)}</span>
            )}
          </button>
          <button
            className="icon mobile-toggle"
            aria-label="باز کردن منو"
            aria-expanded={mobile}
            onClick={() => setMobile(!mobile)}
          >
            <MenuIcon />
          </button>
        </div>
      </header>
      <main id="main">
        <section className="signature-hero">
          <div className="signature-copy">
            <div className="place-note">
              <span className="tiny-percent">٪</span> یک کافه، حوالی پارک پلیس.
            </div>
            <h1>
              کمی قهوه.
              <br />
              کمی شکلات.
              <br />
              <span className="headline-last">تمامِ حال خوب.</span>
            </h1>
            <p>
              بعضی چیزها را نمی‌شود اندازه گرفت.
              <br />
              مثل عطر قهوه، لذت شکلات، یا یک قرار بی‌عجله.
            </p>
            <div className="signature-actions">
              <a className="button copper" href="#shop">
                طعم خودت را پیدا کن <ArrowLeft size={19} />
              </a>
              <button className="menu-link" onClick={() => setPanel("menu")}>
                امروز در کافه <ArrowUpLeft size={19} />
              </button>
            </div>
            <div className="signature-caption">
              <span>
                از دانه تا فنجان،
                <br />
                از درصد تا شما.
              </span>
              <span className="caption-line" />
              <span>قهوه · شکلات · تجهیزات</span>
            </div>
          </div>
          <div
            className="signature-art"
            aria-label="نشان درصد با ترکیب تصاویر قهوه و شکلات"
          >
            <div className="art-orbit" aria-hidden="true" />
            <div className="art-disc disc-coffee">
              <img
                src="./images/coffee.jpg"
                alt="فنجان قهوه، نیمه اول نشان درصد"
              />
              <span>یک جرعه آرامش</span>
            </div>
            <div className="percent-stroke" aria-hidden="true">
              <span>درصد</span>
            </div>
            <div className="art-disc disc-chocolate">
              <img
                src="./images/chocolate.jpg"
                alt="تکه‌های شکلات، نیمه دوم نشان درصد"
              />
              <span>یک تکه خوشحالی</span>
            </div>
            <span className="art-scribble" aria-hidden="true">
              برای تو، با عشق.
            </span>
          </div>
          <div className="hero-bottom-note">
            <span>درصدی از روزت را برای خودت نگه دار.</span>
            <a href="#collections">
              پایین‌تر، خوش‌طعم‌تر <ArrowLeft size={17} />
            </a>
          </div>
        </section>
        <section className="values">
          <span>
            <Coffee /> قهوه برای هر سلیقه
          </span>
          <span>
            <ShoppingBag /> شکلات و تجهیزات منتخب
          </span>
          <span>
            <Heart /> با دقت انتخاب شده، با عشق آماده شده
          </span>
        </section>
        <section id="collections" className="section collections">
          <div className="section-heading">
            <div>
              <span className="eyebrow">انتخاب با شما، وسواس با ما.</span>
              <h2>سه بهانه برای یک حال خوب.</h2>
            </div>
            <a href="#shop">
              همه محصولات <ArrowLeft size={18} />
            </a>
          </div>
          <div className="collection-grid">
            {[
              {
                name: "قهوه",
                text: "صبح را خوش‌عطر شروع کنید",
                image: "beans",
              },
              {
                name: "شکلات",
                text: "کمی شیرینی، کمی کشف",
                image: "chocolate",
              },
              {
                name: "ماگ و تجهیزات",
                text: "همراه‌های کوچکِ هر روز",
                image: "mug",
              },
            ].map((c) => (
              <a
                href="#shop"
                key={c.name}
                className="collection"
                onClick={() => setCategory(c.name)}
              >
                <img
                  loading="lazy"
                  src={"./images/" + c.image + ".jpg"}
                  alt={c.name}
                />
                <div>
                  <small>{c.text}</small>
                  <h3>{c.name}</h3>
                </div>
                <span>
                  <ArrowUpLeft />
                </span>
              </a>
            ))}
          </div>
        </section>
        <section className="section shop" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">از قفسه‌های درصد</span>
              <h2>انتخاب بعدی شما اینجاست</h2>
            </div>
            <span className="muted">محصولات و قیمت‌ها نمونه هستند</span>
          </div>
          <div className="shop-tools">
            <div className="tabs" aria-label="دسته محصولات">
              {categories.map((c) => (
                <button
                  key={c}
                  className={category === c ? "selected" : ""}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="filters">
              <label className="search">
                <Search size={18} />
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="دنبال چی می‌گردید؟"
                  aria-label="جست‌وجوی محصولات"
                />
              </label>
              <label className="sort">
                <SlidersHorizontal size={17} />
                <select
                  aria-label="مرتب‌سازی"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="default">منتخب درصد</option>
                  <option value="low">قیمت: کم به زیاد</option>
                  <option value="high">قیمت: زیاد به کم</option>
                </select>
              </label>
            </div>
          </div>
          {category === categories[0] && !query && sort === "default" && (
            <div className="house-selection">
              <div className="house-copy">
                <span className="house-stamp">برشته برای روزهای شما</span>
                <h3>
                  یک طعم.
                  <br />
                  امضای درصد.
                </h3>
                <p>
                  ترکیب روزانه؛ شکلاتی، متعادل و خوش‌عطر.
                  <br />
                  برای اولین فنجان صبح و آخرین مکث عصر.
                </p>
                <button
                  className="button copper"
                  onClick={() =>
                    openProduct(products.find((p) => p.id === 1) || products[0])
                  }
                >
                  کشف ترکیب روزانه <ArrowUpLeft size={19} />
                </button>
                <small>طرح بسته‌بندی و مشخصات، نمونه پیشنهادی هستند.</small>
              </div>
              <div
                className="bag-stage"
                aria-label="طرح پیشنهادی بسته‌بندی قهوه درصد"
              >
                <span className="stage-word" aria-hidden="true">
                  درصد
                </span>
                <div className="coffee-bag">
                  <div className="bag-seal" />
                  <span className="bag-brand">
                    درصد <b>٪</b>
                  </span>
                  <span className="bag-window">
                    <img
                      src="./images/beans.jpg"
                      alt="دانه‌های قهوه ترکیب روزانه"
                    />
                  </span>
                  <div className="bag-label">
                    <strong>ترکیب روزانه</strong>
                    <span>شکلاتی · متعادل · خوش‌عطر</span>
                    <small>۲۵۰ گرم / دانه قهوه</small>
                  </div>
                  <div className="bag-bottom" />
                </div>
                <span className="bag-caption">
                  از قفسه درصد،
                  <br />
                  به گوشه دنج خانه.
                </span>
              </div>
            </div>
          )}
          <div className="product-grid">{visible.map(card)}</div>
          {!visible.length && (
            <div className="empty">
              محصولی پیدا نشد.
              <button
                onClick={() => {
                  setQuery("");
                  setCategory(categories[0]);
                }}
              >
                نمایش همه محصولات
              </button>
            </div>
          )}
        </section>
        <section className="finder-invite">
          <Coffee size={34} />
          <div>
            <h2>فنجان شما، سلیقه شما.</h2>
            <p>
              با چه دستگاهی دم می‌کنی؟ چه طعمی دوست داری؟ با دو انتخاب، قهوه‌ات
              را پیدا کن.
            </p>
          </div>
          <button className="button copper" onClick={() => setPanel("finder")}>
            پیدا کردن قهوه من <ArrowLeft size={18} />
          </button>
        </section>
        <section id="story" className="story">
          <div className="story-image">
            <img
              loading="lazy"
              src="./images/cafe.jpg"
              alt="فضای نمونه یک کافه با نور گرم"
            />
            <span>اینجا، عجله را پشت در بگذارید.</span>
          </div>
          <div className="story-content">
            <span className="eyebrow">قصه از یک فنجان شروع می‌شود</span>
            <h2>
              برای ما، قهوه
              <br />
              بهانه‌ی با هم بودن است.
            </h2>
            <p>
              درصد، جایی برای مکث‌های کوتاه و گفت‌وگوهای طولانی. از انتخاب دانه
              قهوه تا پیدا کردن شکلاتی تازه، دوست داریم هر بار چیزی برای خوشحال
              کردن شما داشته باشیم.
            </p>
            <p>
              برای یک قهوه گذری بیایید، یا ماگ محبوبتان را پیدا کنید و بخشی از
              این حال خوب را با خودتان به خانه ببرید.
            </p>
            <a href="#visit">
              منتظر دیدارتان هستیم <ArrowLeft size={20} />
            </a>
          </div>
        </section>
        <section className="section menu-preview" id="cafe-menu">
          <div className="menu-preview-copy">
            <span className="eyebrow">امروز چه می‌نوشید؟</span>
            <h2>
              قرار بعدی،
              <br />
              یک فنجان در درصد.
            </h2>
            <p>از اسپرسوی پرقدرت تا لاته نرم و هات‌چاکلت غلیظ.</p>
            <button className="button dark" onClick={() => setPanel("menu")}>
              دیدن منوی کافه <ArrowLeft size={18} />
            </button>
          </div>
          <div className="menu-tasting-card">
            <div className="tasting-photo">
              <img
                loading="lazy"
                src="./images/coffee.jpg"
                alt="قهوه در یک فنجان، تصویر نمونه منو"
              />
              <span>گرم. آرام. خوش‌عطر.</span>
            </div>
            <div className="tasting-content">
              <div className="tasting-heading">
                <span>چند طعم برای شروع</span>
                <Coffee size={18} />
              </div>
              {menu
                .filter((m) => ["لاته", "آیس لاته", "موکا"].includes(m.name))
                .map((m) => (
                  <button key={m.name} onClick={() => setPanel("menu")}>
                    <span>
                      {m.name}
                      <small>{m.category}</small>
                    </span>
                    <strong>{money(m.price)}</strong>
                    <ArrowUpLeft size={16} />
                  </button>
                ))}
              <p>منوی نمونه؛ قیمت‌ها نیازمند تأیید کافه هستند.</p>
            </div>
          </div>
        </section>
        <section id="visit" className="visit">
          <div>
            <MapPin size={30} />
            <h2>درصد، همین حوالی شماست.</h2>
            <p>تهران، اتوبان باقری، بلوار استقلال، روبه‌روی پارک پلیس</p>
            <a
              className="button outline"
              href="https://www.google.com/maps/search/?api=1&query=Tehran+Police+Park+Esteghlal+Boulevard"
              target="_blank"
              rel="noreferrer"
            >
              مشاهده محدوده روی نقشه <ArrowUpLeft size={18} />
            </a>
            <small>
              موقعیت دقیق و ساعت کاری پس از تأیید کافه اضافه می‌شود.
            </small>
          </div>
          <div className="visit-mark" aria-hidden="true">
            ٪
          </div>
        </section>
      </main>
      <footer>
        <a className="brand" href="#">
          <span className="brand-symbol">٪</span>
          <span>
            درصد<small>یک فنجان نزدیک‌تر</small>
          </span>
        </a>
        <p>قهوه، شکلات و همراه‌های یک روز خوب.</p>
        <div>
          <a href="#shop">فروشگاه</a>
          <button onClick={() => setPanel("menu")}>منوی کافه</button>
          <button onClick={() => setPanel("admin")}>مدیریت نمایشی</button>
        </div>
        <small>
          نمونه اولیه کافه درصد · تصاویر آرشیوی و اطلاعات محصول نمونه هستند.
        </small>
      </footer>
      <dialog
        className={
          panel === "menu"
            ? "menu-dialog"
            : panel === "finder"
              ? "finder-dialog"
              : undefined
        }
        aria-labelledby="dialog-title"
        ref={dialog}
        onCancel={() => setPanel(null)}
        onClose={() => setPanel(null)}
      >
        <div className="dialog-header">
          <h2 id="dialog-title">
            {panel === "finder"
              ? "قهوه مناسب شما"
              : panel === "cart"
                ? "سبد خرید"
                : panel === "favorites"
                  ? "علاقه‌مندی‌های شما"
                  : panel === "menu"
                    ? "منوی کافه درصد"
                    : panel === "admin"
                      ? "مدیریت نمایشی"
                      : selected?.name}
          </h2>
          <button
            className="icon"
            aria-label="بستن"
            onClick={() => setPanel(null)}
          >
            <X />
          </button>
        </div>
        {panel === "finder" && (
          <CoffeeFinder
            products={products}
            onProduct={openProduct}
            onAdd={add}
          />
        )}
        {panel === "cart" && (
          <>
            <p className="notice">
              خرید نمایشی است؛ پرداخت و ثبت سفارش واقعی فعال نیست.
            </p>
            {count === 0 ? (
              <p className="empty">
                سبدتان هنوز خالی است. یک طعم تازه انتخاب کنید.
              </p>
            ) : (
              <>
                {products
                  .filter((p) => cart[p.id] > 0)
                  .map((p) => (
                    <div className="cart-row" key={p.id}>
                      <img src={p.image} alt="" />
                      <div>
                        <strong>{p.name}</strong>
                        <small>{money(p.price)}</small>
                        <div className="quantity">
                          <button
                            aria-label={"کاهش تعداد " + p.name}
                            onClick={() =>
                              setCart((c) => ({
                                ...c,
                                [p.id]: Math.max(0, c[p.id] - 1),
                              }))
                            }
                          >
                            <Minus size={16} />
                          </button>
                          <span>
                            {new Intl.NumberFormat("fa-IR").format(cart[p.id])}
                          </span>
                          <button
                            aria-label={"افزایش تعداد " + p.name}
                            onClick={() => add(p.id)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="icon"
                        aria-label={"حذف " + p.name}
                        onClick={() => setCart((c) => ({ ...c, [p.id]: 0 }))}
                      >
                        <X size={17} />
                      </button>
                    </div>
                  ))}
                <div className="coupon">
                  <label htmlFor="coupon">کد تخفیف نمونه: DARSAD10</label>
                  <div>
                    <input
                      id="coupon"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="کد تخفیف"
                    />
                    <button
                      className="button dark"
                      onClick={() => {
                        const ok = coupon.trim().toUpperCase() === "DARSAD10";
                        setDiscount(ok);
                        setCouponError(ok ? "" : "کد تخفیف معتبر نیست.");
                      }}
                    >
                      اعمال
                    </button>
                  </div>
                  <p role="status">
                    {discount ? "تخفیف ۱۰ درصد اعمال شد" : couponError}
                  </p>
                </div>
                <div className="total">
                  <span>جمع محصولات</span>
                  <strong>{money(total)}</strong>
                </div>
                {discount && (
                  <div className="total">
                    <span>تخفیف</span>
                    <strong>{money(total * 0.1)}</strong>
                  </div>
                )}
                <div className="total final-total">
                  <span>مبلغ نهایی</span>
                  <strong>{money(total * (discount ? 0.9 : 1))}</strong>
                </div>
                <button
                  className="button copper full"
                  onClick={() =>
                    notify("این نسخه نمایشی است و سفارشی ثبت نمی‌شود.")
                  }
                >
                  بررسی سفارش نمایشی <ArrowLeft size={18} />
                </button>
              </>
            )}
          </>
        )}
        {panel === "favorites" && (
          <>
            {favorites.length ? (
              <div className="product-grid modal-grid">
                {products.filter((p) => favorites.includes(p.id)).map(card)}
              </div>
            ) : (
              <p className="empty">
                با لمس قلب کنار محصول، آن را اینجا نگه دارید.
              </p>
            )}
          </>
        )}
        {panel === "menu" && <CafeMenu />}
        {panel === "admin" && (
          <>
            <p className="notice">
              پنل عمومی نمونه؛ بدون ورود امن. تغییرات فقط در این مرورگر ذخیره
              می‌شوند.
            </p>
            <div className="admin-stats">
              <div>
                <strong>{products.length}</strong>محصول نمونه
              </div>
              <div>
                <strong>{reviews.length}</strong>نظر ثبت‌شده
              </div>
            </div>
            {products.map((p) => (
              <form
                className="admin-row"
                key={p.id}
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  const price = Number(f.get("price"));
                  if (!Number.isFinite(price) || price <= 0) return;
                  setProducts((all) =>
                    all.map((x) =>
                      x.id === p.id
                        ? { ...x, name: String(f.get("name")).trim(), price }
                        : x,
                    ),
                  );
                  notify("تغییرات نمونه ذخیره شد");
                }}
              >
                <label>
                  نام محصول
                  <input
                    name="name"
                    defaultValue={p.name}
                    required
                    maxLength={80}
                  />
                </label>
                <label>
                  قیمت (تومان)
                  <input
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={p.price}
                    required
                  />
                </label>
                <button className="button dark">ذخیره</button>
              </form>
            ))}
          </>
        )}
        {panel === "product" && selected && (
          <>
            <img
              className="detail-image"
              src={selected.image}
              alt={selected.name}
            />
            <p>{selected.note}</p>
            <strong>
              {money(
                products.find((p) => p.id === selected.id)?.price ||
                  selected.price,
              )}
            </strong>
            <p className="notice">
              مشخصات و تصویر نمونه هستند؛ موجودی و برند واقعی بعداً تکمیل
              می‌شود.
            </p>
            <button
              className="button copper full"
              onClick={() => add(selected.id)}
            >
              افزودن به سبد <ShoppingBag size={18} />
            </button>
            <h3 className="review-heading">نظر شما درباره این محصول</h3>
            <p className="muted">نظرات آزمایشی به‌صورت محلی ذخیره می‌شوند.</p>
            <form
              className="review"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                setReviews((r) => [
                  ...r,
                  {
                    name: String(f.get("name")).trim(),
                    productId: selected.id,
                    text: String(f.get("text")).trim(),
                    rating,
                  },
                ]);
                e.currentTarget.reset();
                notify("نظر نمونه ذخیره شد");
              }}
            >
              <label>
                نام شما
                <input name="name" required maxLength={40} />
              </label>
              <label>
                امتیاز
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {new Intl.NumberFormat("fa-IR").format(n)} از ۵
                    </option>
                  ))}
                </select>
              </label>
              <label>
                نظر شما
                <textarea name="text" required maxLength={500} />
              </label>
              <button className="button dark">ثبت نظر نمونه</button>
            </form>
            {reviews
              .filter((r) => r.productId === selected.id)
              .map((r, i) => (
                <div className="review-item" key={i}>
                  <strong>{r.name}</strong>
                  <span>
                    <Star size={14} />
                    {new Intl.NumberFormat("fa-IR").format(r.rating)}
                  </span>
                  <p>{r.text}</p>
                </div>
              ))}
          </>
        )}
      </dialog>
      <div
        className={"toast " + (toast ? "show" : "")}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <Check size={18} />
            {toast}
          </>
        )}
      </div>
    </>
  );
}
