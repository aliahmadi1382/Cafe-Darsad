import { useState } from "react";
import { ArrowUpLeft, Coffee, Snowflake, Search } from "lucide-react";
import { menu, money } from "../data";

const groups = ["همه نوشیدنی‌ها", "قهوه گرم", "قهوه سرد", "شکلات و بیشتر"];
const normalize = (value: string) =>
  value
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .trim();
export default function CafeMenu() {
  const [group, setGroup] = useState(groups[0]);
  const [query, setQuery] = useState("");
  const drinks = menu.filter(
    (item) =>
      (group === groups[0] || item.category === group) &&
      normalize(item.name + " " + item.note + " " + item.detail).includes(
        normalize(query),
      ),
  );
  return (
    <div className="cafe-menu">
      <aside className="menu-editorial">
        <div className="menu-editorial-top">
          <span>درصد</span>
          <Coffee size={23} />
        </div>
        <h3>
          برای این لحظه،
          <br />
          چه طعمی؟
        </h3>
        <p>
          یک انتخاب ساده،
          <br />
          برای کمی بهتر شدن روز.
        </p>
        <div className="menu-editorial-photo">
          <img src="./images/hero.jpg" alt="دم‌آوری آرام قهوه در کافه" />
        </div>
        <div className="menu-editorial-foot">
          <span>تهران، حوالی پارک پلیس</span>
          <ArrowUpLeft size={20} />
        </div>
      </aside>
      <div className="menu-browser">
        <div className="menu-intro">
          <span>منوی نوشیدنی‌ها</span>
          <p>گرم و دل‌چسب، یا خنک و سرحال.</p>
        </div>
        <div className="menu-group-list" aria-label="دسته‌بندی منوی کافه">
          {groups.map((g) => (
            <button
              key={g}
              aria-pressed={g === group}
              className={g === group ? "chosen" : ""}
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>
        <label className="menu-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اسم یا طعم مورد علاقه‌ات…"
            aria-label="جست‌وجوی منوی کافه"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="پاک کردن جست‌وجوی منو"
            >
              پاک کردن
            </button>
          )}
        </label>
        <p className="menu-result-count" role="status">
          {drinks.length.toLocaleString("fa-IR")} نوشیدنی برای انتخاب
        </p>
        <div className="drink-list">
          {drinks.map((item) => (
            <article className="drink" key={item.name}>
              <span
                className={
                  "drink-icon " + (item.category === "قهوه سرد" ? "iced" : "")
                }
              >
                {item.category === "قهوه سرد" ? (
                  <Snowflake size={21} />
                ) : (
                  <Coffee size={21} />
                )}
              </span>
              <div className="drink-description">
                <div className="drink-name">
                  <h4>{item.name}</h4>
                  {item.signature && <span>پیشنهاد درصد</span>}
                </div>
                <p>{item.note}</p>
                <small>{item.detail}</small>
              </div>
              <strong className="drink-price">{money(item.price)}</strong>
            </article>
          ))}
        </div>
        {!drinks.length && (
          <div className="menu-empty">
            <Coffee size={30} />
            <p>این طعم را پیدا نکردیم.</p>
            <button
              onClick={() => {
                setQuery("");
                setGroup(groups[0]);
              }}
            >
              نمایش همه نوشیدنی‌ها
            </button>
          </div>
        )}
        <div className="menu-disclaimer">
          <span className="demo-dot" />
          منو و قیمت‌ها نمونه‌اند. برای حساسیت غذایی، ترکیبات را با کافه بررسی
          کنید.
        </div>
      </div>
    </div>
  );
}
