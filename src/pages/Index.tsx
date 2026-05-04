import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/b1be1f87-1564-4f29-a677-068277bf3d11/files/16854267-548b-4293-ab82-a6228dcb2465.jpg";
const REPAIR_IMAGE = "https://cdn.poehali.dev/projects/b1be1f87-1564-4f29-a677-068277bf3d11/files/f37b82e3-841c-4942-bec1-17a5e54fba2a.jpg";

// данные услуг
const services = [
  {
    id: 1,
    icon: "Smartphone",
    title: "Ремонт смартфонов",
    description: "Замена экранов, аккумуляторов, разъёмов. Ремонт после залития. Работаем со всеми брендами: Apple, Samsung, Xiaomi, Huawei и др.",
    price: "от 500 ₽",
    time: "от 30 минут",
  },
  {
    id: 2,
    icon: "Laptop",
    title: "Ремонт ноутбуков",
    description: "Замена матриц, клавиатур, аккумуляторов. Чистка от пыли, замена термопасты. Восстановление после залития.",
    price: "от 800 ₽",
    time: "от 1 часа",
  },
  {
    id: 3,
    icon: "Monitor",
    title: "Ремонт компьютеров",
    description: "Диагностика и ремонт системных блоков. Замена комплектующих. Установка Windows и программного обеспечения.",
    price: "от 700 ₽",
    time: "от 2 часов",
  },
  {
    id: 4,
    icon: "Gamepad2",
    title: "Ремонт приставок",
    description: "Ремонт PlayStation, Xbox, Nintendo. Замена дисковода, джойстиков, разъёмов HDMI. Прошивка консолей.",
    price: "от 600 ₽",
    time: "от 1 часа",
  },
  {
    id: 5,
    icon: "Tablet",
    title: "Ремонт планшетов",
    description: "Замена экранов и тачскринов, аккумуляторов. Ремонт разъёмов зарядки. iPad, Samsung, Lenovo и другие.",
    price: "от 700 ₽",
    time: "от 1 часа",
  },
  {
    id: 6,
    icon: "Headphones",
    title: "Ремонт наушников и техники",
    description: "Ремонт беспроводных и проводных наушников. Мелкий ремонт бытовой электроники и аксессуаров.",
    price: "от 300 ₽",
    time: "от 20 минут",
  },
];

// преимущества
const advantages = [
  { icon: "ShieldCheck", title: "Гарантия на ремонт", desc: "Даём письменную гарантию на все виды работ до 90 дней" },
  { icon: "Zap", title: "Срочный ремонт", desc: "Большинство поломок устраняем при клиенте за 30–60 минут" },
  { icon: "BadgePercent", title: "Честные цены", desc: "Бесплатная диагностика. Называем стоимость до начала ремонта" },
  { icon: "Wrench", title: "Только оригиналы", desc: "Используем качественные запчасти от проверенных поставщиков" },
  { icon: "UserCheck", title: "Опытные мастера", desc: "Мастера с опытом от 5 лет. Постоянно повышаем квалификацию" },
  { icon: "MapPin", title: "Удобное расположение", desc: "Находимся в центре города. Удобная парковка рядом" },
];

// прайс лист
const priceList = [
  { device: "iPhone", service: "Замена экрана", price: "от 2 500 ₽" },
  { device: "iPhone", service: "Замена аккумулятора", price: "от 1 200 ₽" },
  { device: "Samsung", service: "Замена экрана", price: "от 1 800 ₽" },
  { device: "Samsung", service: "Замена аккумулятора", price: "от 900 ₽" },
  { device: "Ноутбук", service: "Замена матрицы", price: "от 2 000 ₽" },
  { device: "Ноутбук", service: "Чистка + термопаста", price: "от 800 ₽" },
  { device: "ПК", service: "Диагностика", price: "Бесплатно" },
  { device: "ПК", service: "Установка Windows", price: "от 700 ₽" },
  { device: "PlayStation", service: "Замена дисковода", price: "от 1 500 ₽" },
  { device: "Xbox", service: "Ремонт HDMI разъёма", price: "от 1 200 ₽" },
];

// отзывы
const reviews = [
  { name: "Алексей К.", rating: 5, text: "Принёс iPhone с разбитым экраном — заменили за 40 минут прямо при мне. Качество отличное, цена разумная. Рекомендую!", device: "iPhone 13" },
  { name: "Мария П.", rating: 5, text: "Ноутбук начал жутко греться и тормозить. Сделали чистку и замену термопасты, теперь работает как новый. Спасибо мастерам!", device: "Ноутбук Lenovo" },
  { name: "Дмитрий В.", rating: 5, text: "Починили PlayStation 5 — не читал диски. Обратился в 3 места, везде говорили дорого или долго. Здесь сделали за день и с гарантией.", device: "PlayStation 5" },
  { name: "Ольга С.", rating: 5, text: "Залила телефон. Думала всё, но ребята спасли! Восстановили данные и починили. Очень благодарна за профессионализм.", device: "Samsung Galaxy" },
];

// шаги работы
const steps = [
  { number: "01", title: "Диагностика", desc: "Бесплатно оцениваем поломку и называем точную стоимость ремонта" },
  { number: "02", title: "Согласование", desc: "Согласовываем стоимость и сроки. Ремонт только с вашего согласия" },
  { number: "03", title: "Ремонт", desc: "Выполняем ремонт в присутствии клиента или звоним когда готово" },
  { number: "04", title: "Выдача", desc: "Проверяем работу при вас и выдаём гарантийный талон" },
];

export default function App() {
  const [formData, setFormData] = useState({ name: "", phone: "", device: "", problem: "" });
  const [formSent, setFormSent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSent(true);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1a1a2e", background: "#ffffff" }}>

      {/* ========== ШАПКА ========== */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Логотип */}
          <div className="flex items-center gap-3" style={{ cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg, #e8440a, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(232,68,10,0.35)" }}>
              <Icon name="Wrench" size={22} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
                Techno<span style={{ color: "#e8440a" }}>Expert</span>
              </div>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.05em" }}>СЕРВИСНЫЙ ЦЕНТР • НАХОДКА</div>
            </div>
          </div>

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-6">
            {[["services", "Услуги"], ["prices", "Цены"], ["how", "Как мы работаем"], ["reviews", "Отзывы"], ["contacts", "Контакты"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", fontSize: 14, color: "#555", cursor: "pointer", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e8440a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#555")}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Телефон в шапке */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+74236001234" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>+7 (4236) 00-12-34</div>
              <div style={{ fontSize: 11, color: "#888", textAlign: "right" }}>Пн–Вс 9:00–21:00</div>
            </a>
            <button
              onClick={() => scrollTo("contacts")}
              style={{ background: "#e8440a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c73709")}
              onMouseLeave={e => (e.currentTarget.style.background = "#e8440a")}
            >
              Оставить заявку
            </button>
          </div>

          {/* Мобильное меню */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={26} style={{ color: "#1a1a2e" }} />
          </button>
        </div>

        {/* Мобильное меню раскрытое */}
        {mobileMenuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #eee", padding: "16px 20px 20px" }}>
            {[["services", "Услуги"], ["prices", "Цены"], ["how", "Как мы работаем"], ["reviews", "Отзывы"], ["contacts", "Контакты"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", fontSize: 16, color: "#333", cursor: "pointer", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                {label}
              </button>
            ))}
            <a href="tel:+74236001234" style={{ display: "block", fontSize: 20, fontWeight: 700, color: "#e8440a", marginTop: 12, textDecoration: "none" }}>
              +7 (4236) 00-12-34
            </a>
          </div>
        )}
      </header>

      {/* ========== ГЕРОЙ ========== */}
      <section id="hero" style={{ position: "relative", overflow: "hidden", minHeight: 600, display: "flex", alignItems: "center" }}>
        {/* Фоновое изображение */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${HERO_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,10,30,0.88) 0%, rgba(10,10,30,0.6) 60%, rgba(10,10,30,0.2) 100%)" }} />

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "80px 20px", width: "100%" }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,68,10,0.2)", border: "1px solid rgba(232,68,10,0.5)", borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8440a", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 13, color: "#ff9970", fontWeight: 500 }}>Принимаем заявки сейчас</span>
            </div>

            <h1 style={{ fontSize: 46, fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.5px" }}>
              Ремонт телефонов,<br />
              <span style={{ color: "#ff6b35" }}>ноутбуков и ПК</span><br />
              в Находке
            </h1>

            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", marginBottom: 36, lineHeight: 1.6 }}>
              Быстро, качественно, с гарантией до 90 дней.<br />
              Бесплатная диагностика. Ремонт при клиенте.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={() => scrollTo("contacts")}
                style={{ background: "#e8440a", color: "#fff", border: "none", borderRadius: 10, padding: "16px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 25px rgba(232,68,10,0.4)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#c73709"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#e8440a"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Оставить заявку
              </button>
              <a href="tel:+74236001234" style={{ textDecoration: "none" }}>
                <button
                  style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 10, padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                >
                  📞 Позвонить
                </button>
              </a>
            </div>

            {/* Цифры */}
            <div className="flex flex-wrap gap-8">
              {[["1000+", "Довольных клиентов"], ["90", "Дней гарантии"], ["30 мин", "Срочный ремонт"], ["0 ₽", "Диагностика"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#ff6b35" }}>{num}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== УСЛУГИ ========== */}
      <section id="services" style={{ padding: "80px 20px", background: "#f8f9fb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8440a", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Что мы ремонтируем</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#1a1a2e", marginBottom: 14, letterSpacing: "-0.3px" }}>Наши услуги</h2>
            <p style={{ fontSize: 17, color: "#666", maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
              Профессиональный ремонт всех видов техники. Работаем с любыми брендами и моделями.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div
                key={service.id}
                style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #eee", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(232,68,10,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "#e8440a33"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "#eee"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #fff4f0, #ffe0d4)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={service.icon as string} size={26} style={{ color: "#e8440a" }} />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>{service.title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65, marginBottom: 18 }}>{service.description}</p>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#e8440a" }}>{service.price}</span>
                  <span style={{ fontSize: 12, color: "#999", background: "#f5f5f5", padding: "4px 10px", borderRadius: 20 }}>⏱ {service.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== КАК МЫ РАБОТАЕМ ========== */}
      <section id="how" style={{ padding: "80px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8440a", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Просто и прозрачно</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#1a1a2e", marginBottom: 14, letterSpacing: "-0.3px" }}>Как мы работаем</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.number} style={{ position: "relative" }}>
                <div style={{ background: "#f8f9fb", borderRadius: 16, padding: 28, height: "100%", border: "1px solid #eee" }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: "#ffe0d4", lineHeight: 1, marginBottom: 16 }}>{step.number}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{step.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block" style={{ position: "absolute", top: "50%", right: -20, transform: "translateY(-50%)", zIndex: 10 }}>
                    <Icon name="ChevronRight" size={24} style={{ color: "#e8440a" }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Фото мастера за работой */}
          <div style={{ marginTop: 60, borderRadius: 20, overflow: "hidden", position: "relative", height: 340 }}>
            <img src={REPAIR_IMAGE} alt="Мастер за ремонтом" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,10,30,0.75) 0%, rgba(10,10,30,0.1) 60%)", display: "flex", alignItems: "center" }}>
              <div style={{ padding: "0 48px" }}>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Ремонт при клиенте</h3>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", maxWidth: 420, lineHeight: 1.6 }}>
                  Вы можете наблюдать за процессом ремонта. Мы работаем честно и открыто.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ПРЕИМУЩЕСТВА ========== */}
      <section style={{ padding: "80px 20px", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#ff6b35", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Почему нас выбирают</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#fff", marginBottom: 14, letterSpacing: "-0.3px" }}>Наши преимущества</h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto" }}>
              Более 5 лет работаем в Находке. За это время завоевали доверие тысяч клиентов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map(adv => (
              <div key={adv.title} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(232,68,10,0.15)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,68,10,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(232,68,10,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={adv.icon as string} size={24} style={{ color: "#ff6b35" }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{adv.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ЦЕНЫ ========== */}
      <section id="prices" style={{ padding: "80px 20px", background: "#f8f9fb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8440a", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Прозрачно и честно</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#1a1a2e", marginBottom: 14, letterSpacing: "-0.3px" }}>Примерные цены</h2>
            <p style={{ fontSize: 17, color: "#666", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
              Точная стоимость определяется после бесплатной диагностики. Ремонт только с вашего согласия.
            </p>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid #eee" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #e8440a, #ff6b35)" }}>
                  <th style={{ padding: "16px 24px", textAlign: "left", color: "#fff", fontSize: 14, fontWeight: 600 }}>Устройство</th>
                  <th style={{ padding: "16px 24px", textAlign: "left", color: "#fff", fontSize: 14, fontWeight: 600 }}>Вид работы</th>
                  <th style={{ padding: "16px 24px", textAlign: "right", color: "#fff", fontSize: 14, fontWeight: 600 }}>Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {priceList.map((row, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #f0f0f0", background: index % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{row.device}</td>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#555" }}>{row.service}</td>
                    <td style={{ padding: "14px 24px", fontSize: 15, fontWeight: 700, color: "#e8440a", textAlign: "right" }}>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontSize: 14, color: "#999", marginBottom: 20 }}>Не нашли свою услугу? Свяжитесь с нами — рассчитаем стоимость индивидуально</p>
            <button
              onClick={() => scrollTo("contacts")}
              style={{ background: "#e8440a", color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c73709")}
              onMouseLeave={e => (e.currentTarget.style.background = "#e8440a")}
            >
              Узнать стоимость
            </button>
          </div>
        </div>
      </section>

      {/* ========== ОТЗЫВЫ ========== */}
      <section id="reviews" style={{ padding: "80px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8440a", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Что говорят клиенты</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#1a1a2e", marginBottom: 14, letterSpacing: "-0.3px" }}>Отзывы</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div key={index} style={{ background: "#f8f9fb", borderRadius: 16, padding: 28, border: "1px solid #eee" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #e8440a, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{review.name[0]}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{review.name}</div>
                      <div style={{ fontSize: 12, color: "#999" }}>{review.device}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: "#f59e0b" }}>{"★".repeat(review.rating)}</div>
                </div>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ФОРМА / КОНТАКТЫ ========== */}
      <section id="contacts" style={{ padding: "80px 20px", background: "#f8f9fb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8440a", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Мы на связи</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#1a1a2e", marginBottom: 14, letterSpacing: "-0.3px" }}>Связаться с нами</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Форма */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid #eee" }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Оставить заявку</h3>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>Перезвоним в течение 15 минут и ответим на все вопросы</p>

              {formSent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, #e8440a, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Icon name="Check" size={32} style={{ color: "#fff" }} />
                  </div>
                  <h4 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Заявка принята!</h4>
                  <p style={{ fontSize: 15, color: "#666" }}>Перезвоним вам в ближайшее время</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 7 }}>Ваше имя *</label>
                    <input
                      type="text"
                      placeholder="Иван Иванов"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", transition: "border 0.2s", boxSizing: "border-box" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#e8440a")}
                      onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 7 }}>Телефон *</label>
                    <input
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      required
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", transition: "border 0.2s", boxSizing: "border-box" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#e8440a")}
                      onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 7 }}>Устройство</label>
                    <input
                      type="text"
                      placeholder="Например: iPhone 14, ноутбук ASUS..."
                      value={formData.device}
                      onChange={e => setFormData({ ...formData, device: e.target.value })}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", transition: "border 0.2s", boxSizing: "border-box" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#e8440a")}
                      onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 7 }}>Опишите проблему</label>
                    <textarea
                      placeholder="Что случилось с устройством?"
                      value={formData.problem}
                      onChange={e => setFormData({ ...formData, problem: e.target.value })}
                      rows={3}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", transition: "border 0.2s", resize: "none", boxSizing: "border-box" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#e8440a")}
                      onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ width: "100%", background: "linear-gradient(135deg, #e8440a, #ff6b35)", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 25px rgba(232,68,10,0.35)", transition: "all 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    Отправить заявку
                  </button>
                  <p style={{ fontSize: 12, color: "#bbb", textAlign: "center", marginTop: 12 }}>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
                </form>
              )}
            </div>

            {/* Контактная информация */}
            <div className="flex flex-col gap-5">
              {[
                { icon: "Phone", title: "Телефон", lines: ["+7 (4236) 00-12-34", "+7 (914) 000-12-34"], link: "tel:+74236001234" },
                { icon: "Clock", title: "Время работы", lines: ["Пн–Вс: 9:00 – 21:00", "Без выходных"] },
                { icon: "MapPin", title: "Адрес", lines: ["г. Находка, ул. Портовая 1", "ТЦ «Центральный», 1 этаж"] },
                { icon: "MessageCircle", title: "Мессенджеры", lines: ["WhatsApp: +7 (914) 000-12-34", "Telegram: @technoexpert25"] },
              ].map(contact => (
                <div key={contact.title} style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #eee", display: "flex", gap: 18 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: "#fff4f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={contact.icon as string} size={22} style={{ color: "#e8440a" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#999", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{contact.title}</div>
                    {contact.lines.map(line => (
                      <div key={line}>
                        {contact.link ? (
                          <a href={contact.link} style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", textDecoration: "none", display: "block" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#e8440a")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#1a1a2e")}
                          >{line}</a>
                        ) : (
                          <div style={{ fontSize: 15, color: "#333", marginBottom: 2 }}>{line}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== ФУТЕР ========== */}
      <footer style={{ background: "#1a1a2e", padding: "40px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #e8440a, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="Wrench" size={18} style={{ color: "#fff" }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Techno<span style={{ color: "#ff6b35" }}>Expert</span></div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Сервисный центр • Находка</div>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>© 2024 TechnoExpert. Все права защищены.</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Ремонт телефонов, ноутбуков, ПК и приставок в Находке</div>
            </div>

            <a href="tel:+74236001234" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#ff6b35" }}>+7 (4236) 00-12-34</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "right" }}>Пн–Вс 9:00–21:00</div>
            </a>
          </div>
        </div>
      </footer>

      {/* Кнопка звонка (мобильная) */}
      <a href="tel:+74236001234" className="md:hidden" style={{ position: "fixed", bottom: 20, right: 20, zIndex: 200, textDecoration: "none" }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg, #e8440a, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 25px rgba(232,68,10,0.5)" }}>
          <Icon name="Phone" size={24} style={{ color: "#fff" }} />
        </div>
      </a>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .hidden { display: none; }
        @media (min-width: 768px) {
          .hidden.md\\:flex { display: flex; }
          .hidden.md\\:block { display: block; }
          .md\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
