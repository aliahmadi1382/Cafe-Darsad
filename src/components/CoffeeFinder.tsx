import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Coffee } from "lucide-react";
import { Product, money } from "../data";
const devices = ["اسپرسوساز", "موکاپات", "فرنچ‌پرس", "قهوه دمی"];
const tastes = ["شکلاتی و متعادل", "میوه‌ای و گلی", "هنوز مطمئن نیستم"];
export default function CoffeeFinder({
  products,
  onProduct,
  onAdd,
}: {
  products: Product[];
  onProduct: (p: Product) => void;
  onAdd: (id: number) => void;
}) {
  const [device, setDevice] = useState("");
  const [taste, setTaste] = useState("");
  const [step, setStep] = useState(0);
  const [added, setAdded] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (step > 0) content.current?.focus();
  }, [step]);
  const product = products.find((p) => p.id === (taste === tastes[1] ? 2 : 1));
  const grind =
    device === devices[0]
      ? "آسیاب ریز مخصوص اسپرسو"
      : device === devices[1]
        ? "آسیاب متوسط رو به ریز برای موکاپات"
        : device === devices[2]
          ? "آسیاب درشت برای فرنچ‌پرس"
          : "آسیاب متوسط متناسب با ابزار دم‌آوری";
  return (
    <div className="coffee-finder">
      <div className="finder-progress" aria-label="پیشرفت راهنمای قهوه">
        {["روش دم‌آوری", "سلیقه طعمی", "پیشنهاد شما"].map((label, i) => (
          <span
            key={label}
            className={step === i ? "current" : step > i ? "done" : ""}
          >
            {step > i ? <Check size={14} /> : (i + 1).toLocaleString("fa-IR")}{" "}
            {label}
          </span>
        ))}
      </div>
      <div
        ref={content}
        tabIndex={-1}
        aria-live="polite"
        className="finder-step"
      >
        {step < 2 ? (
          <>
            <h3>
              {step === 0
                ? "قهوه‌ات را چطور آماده می‌کنی؟"
                : "کدام طعم به سلیقه‌ات نزدیک‌تر است؟"}
            </h3>
            <p className="muted">
              {step === 0
                ? "ابزار دم‌آوری را انتخاب کن تا اندازه آسیاب را هم پیشنهاد بدهیم."
                : "از میان دو قهوه نمونه درصد، انتخاب مناسب‌تری پیدا می‌کنیم."}
            </p>
            <div className="finder-options">
              {(step === 0 ? devices : tastes).map((option) => (
                <button
                  key={option}
                  aria-pressed={(step === 0 ? device : taste) === option}
                  className={
                    (step === 0 ? device : taste) === option ? "selected" : ""
                  }
                  onClick={() =>
                    step === 0 ? setDevice(option) : setTaste(option)
                  }
                >
                  <Coffee size={22} />
                  <span>
                    {option}
                    <small>
                      {option === "قهوه دمی"
                        ? "وی۶۰، کمکس و ابزارهای مشابه"
                        : option === "هنوز مطمئن نیستم"
                          ? "با یک طعم متعادل شروع کن"
                          : ""}
                    </small>
                  </span>
                  {(step === 0 ? device : taste) === option && (
                    <Check size={19} />
                  )}
                </button>
              ))}
            </div>
            <div className="finder-actions">
              {step === 1 && (
                <button className="button outline" onClick={() => setStep(0)}>
                  مرحله قبل
                </button>
              )}
              <button
                className="button copper"
                disabled={step === 0 ? !device : !taste}
                onClick={() => setStep(step + 1)}
              >
                {step === 0 ? "انتخاب طعم" : "دیدن پیشنهاد"}
                <ArrowLeft size={18} />
              </button>
            </div>
          </>
        ) : product ? (
          <>
            <div className="finder-result">
              <img src={product.image} alt={product.name} />
              <div>
                <span className="finder-label">پیشنهاد برای {device}</span>
                <h3>{product.name}</h3>
                <p>
                  {taste === tastes[1]
                    ? "برای علاقه‌مندان به عطر گلی و طعم میوه‌ای؛ یک انتخاب برای کشف طعم‌های تازه."
                    : "با طعم شکلاتی و تعادل بیشتر، انتخابی برای شروع و نوشیدن روزانه."}
                </p>
                <strong>{money(product.price)}</strong>
              </div>
            </div>
            <div className="grind-note">
              <Coffee size={22} />
              <div>
                <strong>{grind}</strong>
                <p>
                  اگر آسیاب داری، دانه کامل انتخاب کن. تنظیم نهایی آسیاب به
                  دستگاه و دستور دم‌آوری بستگی دارد.
                </p>
              </div>
            </div>
            <p className="muted finder-disclaimer">
              این پیشنهاد بر اساس اطلاعات محصولات نمونه است؛ موجودی و مشخصات
              واقعی بعداً تکمیل می‌شوند.
            </p>
            {added && (
              <p role="status" className="finder-added">
                <Check size={16} /> به سبد خرید اضافه شد
              </p>
            )}
            <div className="finder-actions">
              <button
                className="button copper"
                onClick={() => {
                  onAdd(product.id);
                  setAdded(true);
                }}
              >
                {added ? "دوباره افزودن به سبد" : "افزودن به سبد"}
              </button>
              <button
                className="button outline"
                onClick={() => onProduct(product)}
              >
                جزئیات محصول
              </button>
              <button
                className="finder-restart"
                onClick={() => {
                  setStep(0);
                  setAdded(false);
                  setDevice("");
                  setTaste("");
                }}
              >
                شروع دوباره
              </button>
            </div>
          </>
        ) : (
          <p>قهوه پیشنهادی فعلاً در دسترس نیست.</p>
        )}
      </div>
    </div>
  );
}
