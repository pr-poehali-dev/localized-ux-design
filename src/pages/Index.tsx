import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

// ============ ТИПЫ ============
type OrderStatus = "new" | "progress" | "ready" | "done" | "urgent";
type Section = "dashboard" | "orders" | "staff" | "parts" | "schedule" | "reports" | "cabinet";

interface Order {
  id: string;
  client: string;
  phone: string;
  device: string;
  problem: string;
  master: string;
  status: OrderStatus;
  created: string;
  deadline: string;
  cost: number;
  prepaid: number;
  history: HistoryEntry[];
}

interface HistoryEntry {
  date: string;
  action: string;
  user: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  ordersActive: number;
  ordersTotal: number;
  rating: number;
}

interface Part {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
}

interface ScheduleEntry {
  id: string;
  date: string;
  time: string;
  client: string;
  device: string;
  master: string;
  type: string;
}

interface ErrorNotification {
  code: string;
  message: string;
  recommendation: string;
}

// ============ ДАННЫЕ ============
const DEMO_ORDERS: Order[] = [
  { id: "ЗК-001", client: "Иванов А.П.", phone: "+7 (912) 345-67-89", device: "iPhone 13 Pro", problem: "Разбит экран, не работает тачскрин", master: "Сидоров В.И.", status: "progress", created: "22.04.2026", deadline: "25.04.2026", cost: 8500, prepaid: 2000, history: [{ date: "22.04 10:15", action: "Принят в работу", user: "Администратор" }, { date: "22.04 14:30", action: "Диагностика завершена", user: "Сидоров В.И." }, { date: "23.04 09:00", action: "Заказана запчасть: экран", user: "Сидоров В.И." }] },
  { id: "ЗК-002", client: "Петрова М.С.", phone: "+7 (916) 234-56-78", device: "Samsung Galaxy S22", problem: "Не заряжается, гнутый разъём", master: "Козлов А.Е.", status: "ready", created: "21.04.2026", deadline: "24.04.2026", cost: 3200, prepaid: 1000, history: [{ date: "21.04 11:00", action: "Принят в работу", user: "Администратор" }, { date: "22.04 16:45", action: "Разъём заменён, проверка завершена", user: "Козлов А.Е." }] },
  { id: "ЗК-003", client: "Смирнов Д.К.", phone: "+7 (901) 678-90-12", device: "Ноутбук ASUS X550", problem: "Не включается, жалобы на падение", master: "Сидоров В.И.", status: "urgent", created: "23.04.2026", deadline: "24.04.2026", cost: 12000, prepaid: 5000, history: [{ date: "23.04 13:00", action: "Принят срочно", user: "Администратор" }, { date: "23.04 14:00", action: "Выявлено: неисправна материнская плата", user: "Сидоров В.И." }] },
  { id: "ЗК-004", client: "Новикова Е.А.", phone: "+7 (923) 456-78-90", device: "iPad Air 4", problem: "Треснул дисплей", master: "Морозов П.Н.", status: "new", created: "24.04.2026", deadline: "27.04.2026", cost: 11000, prepaid: 3000, history: [{ date: "24.04 09:30", action: "Принят в работу", user: "Администратор" }] },
  { id: "ЗК-005", client: "Федоров С.В.", phone: "+7 (905) 123-45-67", device: "Huawei P40", problem: "Не работает камера, замена модуля", master: "Козлов А.Е.", status: "done", created: "19.04.2026", deadline: "22.04.2026", cost: 5500, prepaid: 5500, history: [{ date: "19.04 10:00", action: "Принят в работу", user: "Администратор" }, { date: "20.04 12:00", action: "Камера заменена", user: "Козлов А.Е." }, { date: "20.04 16:00", action: "Выдан клиенту", user: "Администратор" }] },
  { id: "ЗК-006", client: "Кузнецов Р.О.", phone: "+7 (910) 987-65-43", device: "MacBook Pro 2020", problem: "Клавиатура — залита жидкостью", master: "Морозов П.Н.", status: "progress", created: "22.04.2026", deadline: "26.04.2026", cost: 18000, prepaid: 6000, history: [{ date: "22.04 15:00", action: "Принят в работу", user: "Администратор" }, { date: "23.04 11:00", action: "Разборка, чистка платы", user: "Морозов П.Н." }] },
];

const DEMO_STAFF: Staff[] = [
  { id: "С-001", name: "Сидоров Василий Иванович", role: "Старший мастер", phone: "+7 (912) 111-22-33", ordersActive: 2, ordersTotal: 142, rating: 4.9 },
  { id: "С-002", name: "Козлов Александр Евгеньевич", role: "Мастер", phone: "+7 (912) 444-55-66", ordersActive: 1, ordersTotal: 98, rating: 4.7 },
  { id: "С-003", name: "Морозов Павел Николаевич", role: "Мастер", phone: "+7 (912) 777-88-99", ordersActive: 2, ordersTotal: 76, rating: 4.8 },
  { id: "С-004", name: "Волкова Анна Сергеевна", role: "Администратор", phone: "+7 (912) 000-11-22", ordersActive: 0, ordersTotal: 0, rating: 5.0 },
];

const DEMO_PARTS: Part[] = [
  { id: "З-001", name: "Экран iPhone 13 Pro (OLED)", sku: "SCR-IP13P-BLK", category: "Дисплеи", stock: 3, minStock: 2, price: 4800, supplier: "ТехноПоставка" },
  { id: "З-002", name: "Аккумулятор Samsung Galaxy S22", sku: "BAT-SGS22-OEM", category: "Аккумуляторы", stock: 7, minStock: 3, price: 1200, supplier: "МобилЗапчасть" },
  { id: "З-003", name: "Разъём Type-C Samsung (universal)", sku: "CON-USB-C-SAM", category: "Разъёмы", stock: 12, minStock: 5, price: 350, supplier: "МобилЗапчасть" },
  { id: "З-004", name: "Камера Huawei P40 (основная)", sku: "CAM-HW-P40-M", category: "Камеры", stock: 2, minStock: 2, price: 2100, supplier: "ТехноПоставка" },
  { id: "З-005", name: "Клавиатура MacBook Pro 2020 RU", sku: "KBD-MBP20-RU", category: "Клавиатуры", stock: 1, minStock: 2, price: 8900, supplier: "АппАкс" },
  { id: "З-006", name: "Термопаста Arctic MX-4 (4г)", sku: "THM-ARC-MX4-4G", category: "Расходники", stock: 15, minStock: 5, price: 280, supplier: "КомпМастер" },
  { id: "З-007", name: "Экран iPad Air 4 (оригинал)", sku: "SCR-IPAD-A4-ORG", category: "Дисплеи", stock: 0, minStock: 1, price: 7200, supplier: "АппАкс" },
];

const DEMO_SCHEDULE: ScheduleEntry[] = [
  { id: "РП-001", date: "28.04.2026", time: "10:00", client: "Захаров Б.П.", device: "iPhone 12", master: "Сидоров В.И.", type: "Приём" },
  { id: "РП-002", date: "28.04.2026", time: "11:30", client: "Лебедева О.К.", device: "Lenovo IdeaPad", master: "Морозов П.Н.", type: "Выдача" },
  { id: "РП-003", date: "28.04.2026", time: "14:00", client: "Тимофеев А.С.", device: "Samsung A52", master: "Козлов А.Е.", type: "Приём" },
  { id: "РП-004", date: "29.04.2026", time: "10:30", client: "Иванов А.П.", device: "iPhone 13 Pro", master: "Сидоров В.И.", type: "Выдача" },
  { id: "РП-005", date: "29.04.2026", time: "13:00", client: "Борисова Н.Д.", device: "ASUS ZenBook", master: "Морозов П.Н.", type: "Приём" },
  { id: "РП-006", date: "30.04.2026", time: "09:30", client: "Смирнов Д.К.", device: "Ноутбук ASUS", master: "Сидоров В.И.", type: "Выдача" },
];

// ============ УТИЛИТЫ ============
const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Новый",
  progress: "В работе",
  ready: "Готов",
  done: "Выдан",
  urgent: "Срочный",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  new: "status-new",
  progress: "status-progress",
  ready: "status-ready",
  done: "status-done",
  urgent: "status-urgent",
};

const ERROR_MESSAGES: Record<string, ErrorNotification> = {
  FORM_EMPTY: { code: "ERR-001", message: "Не заполнены обязательные поля", recommendation: "Заполните все поля, отмеченные *, и повторите попытку." },
  ORDER_NOT_FOUND: { code: "ERR-002", message: "Заказ не найден", recommendation: "Проверьте номер заказа и повторите поиск." },
  LOW_STOCK: { code: "ERR-003", message: "Недостаточно запчастей на складе", recommendation: "Оформите заявку поставщику для пополнения запаса." },
  SAVE_ERROR: { code: "ERR-004", message: "Ошибка сохранения данных", recommendation: "Проверьте подключение к сети и повторите попытку. Если ошибка повторяется — обратитесь в поддержку." },
};

// ============ КОМПОНЕНТ ОШИБКИ ============
function ErrorToast({ err, onClose }: { err: ErrorNotification; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in" style={{ maxWidth: 380 }}>
      <div className="card-dark rounded-lg p-4" style={{ borderColor: "rgba(255,60,60,0.6)", boxShadow: "0 0 20px rgba(255,50,50,0.3)" }}>
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={18} className="mt-0.5 flex-shrink-0" style={{ color: "#ff6060" }} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="kbd-hint">{err.code}</span>
              <span style={{ fontFamily: "'Times New Roman', serif", fontSize: 13, color: "#ff8080", fontWeight: 700 }}>{err.message}</span>
            </div>
            <p style={{ fontSize: 11, color: "rgba(180,210,255,0.8)", lineHeight: 1.5 }}>{err.recommendation}</p>
          </div>
          <button onClick={onClose} style={{ color: "rgba(120,150,200,0.7)", fontSize: 16, lineHeight: 1 }}>×</button>
        </div>
      </div>
    </div>
  );
}

// ============ ГОРЯЧИЕ КЛАВИШИ ============
function HotkeyHint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5" style={{ fontSize: 11, color: "rgba(100,150,220,0.7)" }}>
      <span className="kbd-hint">{keys}</span>
      <span>{label}</span>
    </span>
  );
}

// ============ DASHBOARD SUB-VIEWS ============

type DashView = "main" | "all_orders" | "in_work" | "ready" | "urgent";

function DashAllOrders({ orders, onBack }: { orders: Order[]; onBack: () => void }) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="neon-btn px-3 py-1.5 rounded flex items-center gap-2" style={{ fontSize: 12 }}>
          <Icon name="ArrowLeft" size={14} style={{ color: "var(--neon-cyan)" }} />
          Назад
        </button>
        <h2 style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>
          Все заказы <span style={{ fontSize: 13, color: "rgba(100,150,220,0.6)" }}>— {orders.length} шт.</span>
        </h2>
      </div>
      <div className="card-dark rounded-lg overflow-hidden">
        <table className="table-neon w-full">
          <thead><tr><th>Номер</th><th>Клиент</th><th>Устройство</th><th>Мастер</th><th>Создан</th><th>Срок</th><th>Стоимость</th><th>Статус</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ color: "#60aaff", fontWeight: 600 }}>{o.id}</td>
                <td>{o.client}</td>
                <td>{o.device}</td>
                <td>{o.master}</td>
                <td>{o.created}</td>
                <td>{o.deadline}</td>
                <td style={{ color: "#3ddc84" }}>{o.cost.toLocaleString("ru-RU")} ₽</td>
                <td><span className={`status-badge ${STATUS_CLASS[o.status]}`}>{STATUS_LABELS[o.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashInWork({ orders, onBack }: { orders: Order[]; onBack: () => void }) {
  const busyMasters = DEMO_STAFF.filter(s => s.ordersActive > 0);
  const freeMasters = DEMO_STAFF.filter(s => s.ordersActive === 0);
  const activeOrders = orders.filter(o => o.status === "progress" || o.status === "new");

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="neon-btn px-3 py-1.5 rounded flex items-center gap-2" style={{ fontSize: 12 }}>
          <Icon name="ArrowLeft" size={14} style={{ color: "var(--neon-cyan)" }} />
          Назад
        </button>
        <h2 style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>
          В работе <span style={{ fontSize: 13, color: "rgba(100,150,220,0.6)" }}>— {activeOrders.length} заказов</span>
        </h2>
      </div>
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Свободные — слева */}
        <div className="card-dark rounded-lg p-4" style={{ borderColor: "rgba(61,220,132,0.35)", boxShadow: "0 0 12px rgba(61,220,132,0.1)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="UserCheck" size={16} style={{ color: "#3ddc84" }} />
            <h3 style={{ fontFamily: "'Times New Roman', serif", fontSize: 14, color: "#3ddc84", textShadow: "0 0 8px rgba(61,220,132,0.4)" }}>
              Свободны <span style={{ fontSize: 11, color: "rgba(61,220,132,0.6)" }}>({freeMasters.length})</span>
            </h3>
          </div>
          {freeMasters.length === 0 ? (
            <div style={{ fontSize: 12, color: "rgba(100,140,200,0.5)", textAlign: "center", padding: "20px 0" }}>Все мастера заняты</div>
          ) : freeMasters.map(s => (
            <div key={s.id} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid rgba(0,100,255,0.1)" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(61,220,132,0.12)", border: "1px solid rgba(61,220,132,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="User" size={16} style={{ color: "#3ddc84" }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(200,230,255,0.9)", fontFamily: "'Times New Roman', serif" }}>{s.name}</div>
                <div style={{ fontSize: 10, color: "rgba(61,220,132,0.7)", marginTop: 1 }}>{s.role} · ★ {s.rating}</div>
              </div>
              <div style={{ marginLeft: "auto", background: "rgba(61,220,132,0.12)", border: "1px solid rgba(61,220,132,0.3)", borderRadius: 12, padding: "2px 10px", fontSize: 10, color: "#3ddc84" }}>Свободен</div>
            </div>
          ))}
        </div>

        {/* Занятые — справа */}
        <div className="card-dark rounded-lg p-4" style={{ borderColor: "rgba(255,184,48,0.3)", boxShadow: "0 0 12px rgba(255,184,48,0.08)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="UserCog" size={16} style={{ color: "#ffb830" }} />
            <h3 style={{ fontFamily: "'Times New Roman', serif", fontSize: 14, color: "#ffb830", textShadow: "0 0 8px rgba(255,184,48,0.4)" }}>
              Заняты <span style={{ fontSize: 11, color: "rgba(255,184,48,0.6)" }}>({busyMasters.length})</span>
            </h3>
          </div>
          {busyMasters.map(s => {
            const theirOrders = activeOrders.filter(o => o.master.startsWith(s.name.split(" ")[0]));
            return (
              <div key={s.id} className="py-3" style={{ borderBottom: "1px solid rgba(0,100,255,0.1)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,184,48,0.12)", border: "1px solid rgba(255,184,48,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="User" size={16} style={{ color: "#ffb830" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "rgba(200,230,255,0.9)", fontFamily: "'Times New Roman', serif" }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,184,48,0.7)", marginTop: 1 }}>{s.role} · {s.ordersActive} активных</div>
                  </div>
                  <div style={{ marginLeft: "auto", background: "rgba(255,184,48,0.12)", border: "1px solid rgba(255,184,48,0.3)", borderRadius: 12, padding: "2px 10px", fontSize: 10, color: "#ffb830" }}>Занят</div>
                </div>
                {theirOrders.map(o => (
                  <div key={o.id} className="flex items-center gap-2 ml-12 py-1" style={{ borderTop: "1px solid rgba(0,80,200,0.1)" }}>
                    <span style={{ fontSize: 10, color: "#60aaff" }}>{o.id}</span>
                    <span style={{ fontSize: 10, color: "rgba(160,200,255,0.7)", flex: 1 }}>{o.device}</span>
                    <span className={`status-badge ${STATUS_CLASS[o.status]}`} style={{ fontSize: 10 }}>{STATUS_LABELS[o.status]}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Таблица активных заказов */}
      <div className="card-dark rounded-lg overflow-hidden">
        <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(0,100,255,0.15)" }}>
          <span style={{ fontFamily: "'Times New Roman', serif", fontSize: 13, color: "var(--neon-cyan)" }}>Активные заказы</span>
        </div>
        <table className="table-neon w-full">
          <thead><tr><th>Номер</th><th>Клиент</th><th>Устройство</th><th>Мастер</th><th>Срок</th><th>Статус</th></tr></thead>
          <tbody>
            {activeOrders.map(o => (
              <tr key={o.id}>
                <td style={{ color: "#60aaff", fontWeight: 600 }}>{o.id}</td>
                <td>{o.client}</td>
                <td>{o.device}</td>
                <td>{o.master}</td>
                <td>{o.deadline}</td>
                <td><span className={`status-badge ${STATUS_CLASS[o.status]}`}>{STATUS_LABELS[o.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashReady({ orders, onBack }: { orders: Order[]; onBack: () => void }) {
  const readyOrders = orders.filter(o => o.status === "ready");
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="neon-btn px-3 py-1.5 rounded flex items-center gap-2" style={{ fontSize: 12 }}>
          <Icon name="ArrowLeft" size={14} style={{ color: "var(--neon-cyan)" }} />
          Назад
        </button>
        <h2 style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "#3ddc84", textShadow: "0 0 12px rgba(61,220,132,0.5)" }}>
          Готовы к выдаче <span style={{ fontSize: 13, color: "rgba(61,220,132,0.5)" }}>— {readyOrders.length} шт.</span>
        </h2>
      </div>
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {readyOrders.map(o => (
          <div key={o.id} className="card-dark rounded-lg p-4" style={{ borderColor: "rgba(61,220,132,0.4)", boxShadow: "0 0 14px rgba(61,220,132,0.12)" }}>
            <div className="flex items-start justify-between mb-3">
              <span style={{ fontSize: 14, color: "#3ddc84", fontWeight: 700, textShadow: "0 0 8px rgba(61,220,132,0.5)" }}>{o.id}</span>
              <span className="status-badge status-ready">Готов</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(200,230,255,0.95)", fontFamily: "'Times New Roman', serif", marginBottom: 4 }}>{o.client}</div>
            <div style={{ fontSize: 11, color: "rgba(130,170,230,0.8)", marginBottom: 8 }}>{o.device}</div>
            <div style={{ height: 1, background: "rgba(61,220,132,0.15)", marginBottom: 8 }} />
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)" }}>Мастер</div>
                <div style={{ fontSize: 11, color: "rgba(180,215,255,0.85)" }}>{o.master}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)" }}>Телефон</div>
                <div style={{ fontSize: 11, color: "rgba(180,215,255,0.85)" }}>{o.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)" }}>Стоимость</div>
                <div style={{ fontSize: 12, color: "#3ddc84", fontWeight: 600 }}>{o.cost.toLocaleString("ru-RU")} ₽</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)" }}>Оплачено</div>
                <div style={{ fontSize: 11, color: o.prepaid >= o.cost ? "#3ddc84" : "#ffb830" }}>{o.prepaid.toLocaleString("ru-RU")} ₽</div>
              </div>
            </div>
            {o.prepaid < o.cost && (
              <div style={{ marginTop: 10, padding: "6px 10px", background: "rgba(255,184,48,0.1)", border: "1px solid rgba(255,184,48,0.3)", borderRadius: 5, fontSize: 11, color: "#ffb830" }}>
                ⚠ Доплата: {(o.cost - o.prepaid).toLocaleString("ru-RU")} ₽
              </div>
            )}
          </div>
        ))}
        {readyOrders.length === 0 && (
          <div style={{ fontSize: 13, color: "rgba(100,140,200,0.5)", textAlign: "center", padding: "40px 0", gridColumn: "1 / -1" }}>Готовых к выдаче заказов нет</div>
        )}
      </div>
    </div>
  );
}

function DashUrgent({ orders, onBack }: { orders: Order[]; onBack: () => void }) {
  const urgentOrders = orders.filter(o => o.status === "urgent");
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="neon-btn px-3 py-1.5 rounded flex items-center gap-2" style={{ fontSize: 12 }}>
          <Icon name="ArrowLeft" size={14} style={{ color: "var(--neon-cyan)" }} />
          Назад
        </button>
        <h2 style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "#ff6060", textShadow: "0 0 15px rgba(255,96,96,0.6)" }}>
          Срочные заказы <span style={{ fontSize: 13, color: "rgba(255,96,96,0.5)" }}>— {urgentOrders.length} шт.</span>
        </h2>
      </div>
      {urgentOrders.length === 0 ? (
        <div style={{ fontSize: 13, color: "rgba(100,140,200,0.5)", textAlign: "center", padding: "60px 0" }}>Срочных заказов нет</div>
      ) : (
        <div className="flex flex-col gap-3">
          {urgentOrders.map((o, idx) => (
            <div key={o.id} className="card-dark rounded-lg p-5" style={{ borderColor: "rgba(255,96,96,0.5)", boxShadow: "0 0 18px rgba(255,50,50,0.15)" }}>
              <div className="flex items-center gap-4">
                <div style={{ fontSize: 28, fontWeight: 900, color: "rgba(255,96,96,0.3)", fontFamily: "'Times New Roman', serif", minWidth: 32 }}>#{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontSize: 15, color: "#ff6060", fontWeight: 700, textShadow: "0 0 10px rgba(255,96,96,0.6)" }}>{o.id}</span>
                    <span className="status-badge status-urgent">Срочный</span>
                    <span style={{ fontSize: 10, color: "rgba(255,96,96,0.7)", marginLeft: "auto" }}>Срок: <strong style={{ color: "#ff6060" }}>{o.deadline}</strong></span>
                  </div>
                  <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                    {[["Клиент", o.client], ["Устройство", o.device], ["Мастер", o.master], ["Стоимость", `${o.cost.toLocaleString("ru-RU")} ₽`]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)" }}>{k}</div>
                        <div style={{ fontSize: 11, color: "rgba(200,225,255,0.9)" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, padding: "6px 12px", background: "rgba(255,50,50,0.08)", border: "1px solid rgba(255,50,50,0.2)", borderRadius: 5 }}>
                    <span style={{ fontSize: 10, color: "rgba(255,100,100,0.7)" }}>Проблема: </span>
                    <span style={{ fontSize: 11, color: "rgba(200,225,255,0.85)" }}>{o.problem}</span>
                  </div>
                  {o.history.length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 10, color: "rgba(100,140,200,0.6)" }}>
                      Последнее: <span style={{ color: "rgba(160,200,255,0.7)" }}>{o.history[o.history.length - 1].action}</span>
                      <span style={{ marginLeft: 6, color: "rgba(100,140,200,0.5)" }}>— {o.history[o.history.length - 1].date}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ DASHBOARD ============
function Dashboard({ orders }: { orders: Order[] }) {
  const [view, setView] = useState<DashView>("main");

  const stats = {
    total: orders.length,
    active: orders.filter(o => o.status === "progress" || o.status === "new").length,
    ready: orders.filter(o => o.status === "ready").length,
    urgent: orders.filter(o => o.status === "urgent").length,
  };

  const monthData = [
    { month: "Янв", count: 34, revenue: 187000 },
    { month: "Фев", count: 41, revenue: 223000 },
    { month: "Мар", count: 38, revenue: 198000 },
    { month: "Апр", count: 29, revenue: 161000 },
  ];
  const maxCount = Math.max(...monthData.map(d => d.count));

  if (view === "all_orders") return <DashAllOrders orders={orders} onBack={() => setView("main")} />;
  if (view === "in_work") return <DashInWork orders={orders} onBack={() => setView("main")} />;
  if (view === "ready") return <DashReady orders={orders} onBack={() => setView("main")} />;
  if (view === "urgent") return <DashUrgent orders={orders} onBack={() => setView("main")} />;

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4" style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>
        Панель управления
      </h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Всего заказов", value: stats.total, icon: "ClipboardList", color: "#60aaff", view: "all_orders" as DashView },
          { label: "В работе", value: stats.active, icon: "Wrench", color: "#ffb830", view: "in_work" as DashView },
          { label: "Готовы к выдаче", value: stats.ready, icon: "CheckCircle", color: "#3ddc84", view: "ready" as DashView },
          { label: "Срочные", value: stats.urgent, icon: "Zap", color: "#ff6060", view: "urgent" as DashView },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setView(s.view)}
            className="card-dark rounded-lg p-4 text-left"
            style={{ cursor: "pointer", transition: "all 0.2s", display: "block", width: "100%", background: undefined }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = s.color + "88"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${s.color}22`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 11, color: "rgba(130,170,230,0.7)", fontFamily: "'Times New Roman', serif", letterSpacing: "0.06em" }}>{s.label}</span>
              <div className="flex items-center gap-1.5">
                <Icon name={s.icon as string} size={16} style={{ color: s.color }} />
                <Icon name="ChevronRight" size={12} style={{ color: s.color + "88" }} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, textShadow: `0 0 15px ${s.color}66`, fontFamily: "'Times New Roman', serif" }}>{s.value}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card-dark rounded-lg p-4">
          <h3 style={{ fontFamily: "'Times New Roman', serif", fontSize: 14, color: "var(--neon-cyan)", marginBottom: 16 }}>
            Количество заказов по месяцам
          </h3>
          <div className="flex items-end gap-3" style={{ height: 140 }}>
            {monthData.map((d) => (
              <div key={d.month} className="flex flex-col items-center flex-1 gap-1">
                <span style={{ fontSize: 10, color: "#60aaff" }}>{d.count}</span>
                <div className="chart-bar w-full rounded-sm" style={{ height: `${(d.count / maxCount) * 110}px` }} />
                <span style={{ fontSize: 10, color: "rgba(130,170,230,0.7)" }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark rounded-lg p-4">
          <h3 style={{ fontFamily: "'Times New Roman', serif", fontSize: 14, color: "var(--neon-cyan)", marginBottom: 12 }}>
            Последние заказы
          </h3>
          <div className="flex flex-col gap-2">
            {orders.slice(0, 4).map(o => (
              <div key={o.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(0,100,255,0.1)" }}>
                <div>
                  <span style={{ fontSize: 11, color: "#60aaff", marginRight: 8 }}>{o.id}</span>
                  <span style={{ fontSize: 11, color: "rgba(180,210,255,0.85)" }}>{o.client}</span>
                </div>
                <span className={`status-badge ${STATUS_CLASS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ ЗАКАЗЫ ============
function Orders({ orders, setOrders, showError }: { orders: Order[]; setOrders: (o: Order[]) => void; showError: (k: string) => void }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newOrder, setNewOrder] = useState({ client: "", phone: "", device: "", problem: "", master: "", deadline: "", cost: "", prepaid: "" });

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q) || o.device.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAddOrder = () => {
    if (!newOrder.client || !newOrder.device || !newOrder.problem || !newOrder.master) {
      showError("FORM_EMPTY");
      return;
    }
    const order: Order = {
      id: `ЗК-${String(orders.length + 1).padStart(3, "0")}`,
      client: newOrder.client,
      phone: newOrder.phone,
      device: newOrder.device,
      problem: newOrder.problem,
      master: newOrder.master,
      deadline: newOrder.deadline,
      status: "new",
      created: new Date().toLocaleDateString("ru-RU"),
      cost: Number(newOrder.cost) || 0,
      prepaid: Number(newOrder.prepaid) || 0,
      history: [{ date: new Date().toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" }), action: "Принят в работу", user: "Администратор" }],
    };
    setOrders([order, ...orders]);
    setShowForm(false);
    setNewOrder({ client: "", phone: "", device: "", problem: "", master: "", deadline: "", cost: "", prepaid: "" });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>Заказы</h2>
        <div className="flex items-center gap-3">
          <HotkeyHint keys="Alt+N" label="Новый заказ" />
          <button className="neon-btn px-4 py-2 rounded" onClick={() => setShowForm(true)}>+ Новый заказ</button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input className="input-neon" style={{ maxWidth: 260 }} placeholder="Поиск по ID, клиенту, устройству..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="select-neon" value={filterStatus} onChange={e => setFilterStatus(e.target.value as OrderStatus | "all")}>
          <option value="all">Все статусы</option>
          {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="card-dark rounded-lg overflow-hidden">
        <table className="table-neon w-full">
          <thead>
            <tr>
              <th>Номер</th><th>Клиент</th><th>Устройство</th><th>Мастер</th><th>Создан</th><th>Срок</th><th>Стоимость</th><th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                <td style={{ color: "#60aaff", fontWeight: 600 }}>{o.id}</td>
                <td>{o.client}</td>
                <td>{o.device}</td>
                <td>{o.master}</td>
                <td>{o.created}</td>
                <td style={{ color: o.status === "urgent" ? "#ff6060" : undefined }}>{o.deadline}</td>
                <td style={{ color: "#3ddc84" }}>{o.cost.toLocaleString("ru-RU")} ₽</td>
                <td><span className={`status-badge ${STATUS_CLASS[o.status]}`}>{STATUS_LABELS[o.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8" style={{ color: "rgba(100,140,200,0.5)" }}>Заказы не найдены</div>
        )}
      </div>

      {/* Детали заказа */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center modal-overlay" onClick={() => setSelected(null)}>
          <div className="card-dark rounded-lg neon-border" style={{ width: 600, maxHeight: "80vh", overflow: "auto", padding: 24 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontFamily: "'Times New Roman', serif", fontSize: 16, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>Заказ {selected.id}</span>
              <button onClick={() => setSelected(null)} style={{ color: "rgba(120,160,220,0.7)", fontSize: 20 }}>×</button>
            </div>
            <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {([
                ["Клиент", selected.client], ["Телефон", selected.phone],
                ["Устройство", selected.device], ["Мастер", selected.master],
                ["Создан", selected.created], ["Срок", selected.deadline],
                ["Стоимость", `${selected.cost.toLocaleString("ru-RU")} ₽`],
                ["Предоплата", `${selected.prepaid.toLocaleString("ru-RU")} ₽`],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)", marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color: "rgba(180,215,255,0.9)" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)", marginBottom: 4 }}>Неисправность</div>
              <div style={{ fontSize: 12, color: "rgba(180,215,255,0.9)" }}>{selected.problem}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--neon-cyan)", marginBottom: 8, fontFamily: "'Times New Roman', serif" }}>История работ</div>
              {selected.history.map((h, i) => (
                <div key={i} className="flex gap-3 py-2" style={{ borderBottom: "1px solid rgba(0,100,255,0.1)" }}>
                  <span style={{ fontSize: 10, color: "rgba(100,140,200,0.6)", whiteSpace: "nowrap" }}>{h.date}</span>
                  <span style={{ fontSize: 11, color: "rgba(180,215,255,0.85)", flex: 1 }}>{h.action}</span>
                  <span style={{ fontSize: 10, color: "rgba(100,140,200,0.5)" }}>{h.user}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Форма нового заказа */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center modal-overlay" onClick={() => setShowForm(false)}>
          <div className="card-dark rounded-lg neon-border" style={{ width: 540, padding: 24 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontFamily: "'Times New Roman', serif", fontSize: 16, color: "var(--neon-cyan)" }}>Новый заказ</span>
              <button onClick={() => setShowForm(false)} style={{ color: "rgba(120,160,220,0.7)", fontSize: 20 }}>×</button>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {([
                ["client", "Клиент *"], ["phone", "Телефон"],
                ["device", "Устройство *"], ["master", "Мастер *"],
                ["deadline", "Срок выполнения"], ["cost", "Стоимость (₽)"],
                ["prepaid", "Предоплата (₽)"],
              ] as [keyof typeof newOrder, string][]).map(([field, label]) => (
                <div key={field}>
                  <label style={{ fontSize: 10, color: "rgba(100,140,200,0.7)", display: "block", marginBottom: 4 }}>{label}</label>
                  <input className="input-neon" value={newOrder[field]} onChange={e => setNewOrder({ ...newOrder, [field]: e.target.value })} />
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: 10, color: "rgba(100,140,200,0.7)", display: "block", marginBottom: 4 }}>Неисправность *</label>
                <textarea className="input-neon" rows={2} style={{ resize: "none" }} value={newOrder.problem} onChange={e => setNewOrder({ ...newOrder, problem: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-4 justify-end">
              <button className="neon-btn px-4 py-2 rounded" onClick={() => setShowForm(false)} style={{ borderColor: "rgba(100,140,200,0.3)", color: "rgba(130,170,220,0.7)" }}>Отмена</button>
              <button className="neon-btn px-4 py-2 rounded" onClick={handleAddOrder}>Создать заказ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ СОТРУДНИКИ ============
function StaffSection() {
  return (
    <div className="animate-fade-in">
      <h2 className="mb-4" style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>Сотрудники</h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {DEMO_STAFF.map(s => (
          <div key={s.id} className="card-dark rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div style={{ fontFamily: "'Times New Roman', serif", fontSize: 14, color: "rgba(200,225,255,0.95)", marginBottom: 3 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "rgba(0,180,255,0.7)" }}>{s.role}</div>
              </div>
              <div style={{ background: "rgba(0,100,255,0.15)", border: "1px solid rgba(0,150,255,0.3)", borderRadius: 20, padding: "2px 10px", fontSize: 11, color: "#60aaff" }}>{s.id}</div>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)", marginBottom: 2 }}>Телефон</div>
                <div style={{ fontSize: 12, color: "rgba(180,215,255,0.9)" }}>{s.phone}</div>
              </div>
              {[["Активных", String(s.ordersActive)], ["Всего", String(s.ordersTotal)], ["Рейтинг", `★ ${s.rating}`]].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "rgba(180,215,255,0.9)" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ ЗАПЧАСТИ ============
function PartsSection({ showError }: { showError: (k: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = DEMO_PARTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>Запчасти и склад</h2>
        <div className="flex items-center gap-3">
          <HotkeyHint keys="Alt+P" label="Поступление" />
          <button className="neon-btn px-4 py-2 rounded" onClick={() => showError("LOW_STOCK")}>+ Поступление</button>
        </div>
      </div>
      <input className="input-neon mb-4" style={{ maxWidth: 300 }} placeholder="Поиск по названию, артикулу..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="card-dark rounded-lg overflow-hidden">
        <table className="table-neon w-full">
          <thead>
            <tr><th>Артикул</th><th>Наименование</th><th>Категория</th><th>На складе</th><th>Мин. запас</th><th>Цена</th><th>Поставщик</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ background: p.stock <= p.minStock ? "rgba(255,50,50,0.04)" : undefined }}>
                <td style={{ color: "#60aaff", fontSize: 11 }}>{p.sku}</td>
                <td style={{ color: p.stock === 0 ? "#ff6060" : undefined }}>{p.name}</td>
                <td style={{ color: "rgba(130,170,230,0.7)" }}>{p.category}</td>
                <td>
                  <span style={{ color: p.stock === 0 ? "#ff6060" : p.stock <= p.minStock ? "#ffb830" : "#3ddc84", fontWeight: 600 }}>{p.stock} шт.</span>
                  {p.stock <= p.minStock && <span style={{ marginLeft: 6, fontSize: 10, color: "#ff8040" }}>⚠ Мало</span>}
                </td>
                <td style={{ color: "rgba(130,170,230,0.7)" }}>{p.minStock} шт.</td>
                <td style={{ color: "#3ddc84" }}>{p.price.toLocaleString("ru-RU")} ₽</td>
                <td style={{ color: "rgba(130,170,230,0.7)" }}>{p.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ РАСПИСАНИЕ ============
function ScheduleSection() {
  const today = "28.04.2026";
  const byDate = DEMO_SCHEDULE.reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {} as Record<string, ScheduleEntry[]>);

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4" style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>Расписание</h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {Object.entries(byDate).map(([date, entries]) => (
          <div key={date} className="card-dark rounded-lg p-4" style={{ borderColor: date === today ? "rgba(0,229,255,0.5)" : undefined, boxShadow: date === today ? "var(--neon-glow)" : undefined }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontFamily: "'Times New Roman', serif", fontSize: 14, color: date === today ? "var(--neon-cyan)" : "rgba(160,200,255,0.85)", textShadow: date === today ? "var(--neon-glow)" : undefined }}>{date}</span>
              {date === today && <span style={{ fontSize: 10, color: "var(--neon-cyan)", background: "rgba(0,180,255,0.1)", padding: "1px 7px", borderRadius: 10, border: "1px solid rgba(0,180,255,0.3)" }}>Сегодня</span>}
            </div>
            {entries.map(e => (
              <div key={e.id} className="py-2" style={{ borderBottom: "1px solid rgba(0,100,255,0.1)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 13, color: "#60aaff", fontWeight: 700 }}>{e.time}</span>
                  <span style={{ fontSize: 10, background: e.type === "Приём" ? "rgba(0,100,255,0.2)" : "rgba(0,180,100,0.15)", color: e.type === "Приём" ? "#60aaff" : "#3ddc84", padding: "1px 7px", borderRadius: 3, border: `1px solid ${e.type === "Приём" ? "rgba(0,100,255,0.4)" : "rgba(0,180,100,0.3)"}` }}>{e.type}</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(180,215,255,0.85)", marginBottom: 2 }}>{e.client} — {e.device}</div>
                <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)" }}>{e.master}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ ОТЧЁТЫ ============
function Reports() {
  const [view, setView] = useState<"table" | "chart">("chart");
  const data = [
    { month: "Январь", orders: 34, revenue: 187000, avg: 5500, done: 30 },
    { month: "Февраль", orders: 41, revenue: 223000, avg: 5439, done: 38 },
    { month: "Март", orders: 38, revenue: 198000, avg: 5210, done: 35 },
    { month: "Апрель", orders: 29, revenue: 161000, avg: 5552, done: 25 },
  ];
  const maxRev = Math.max(...data.map(d => d.revenue));

  return (
    <div className="animate-fade-in">
      {/* Шапка с логотипом */}
      <div className="card-dark rounded-lg p-4 mb-4 flex items-center justify-between" style={{ borderColor: "rgba(0,180,255,0.3)" }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, rgba(0,100,255,0.4), rgba(0,200,255,0.3))", borderRadius: 8, border: "1px solid rgba(0,180,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--neon-glow)" }}>
            <Icon name="Wrench" size={22} style={{ color: "var(--neon-cyan)" }} />
          </div>
          <div>
            <div className="logo-header" style={{ fontSize: 16 }}>РемМастер</div>
            <div style={{ fontSize: 10, color: "rgba(100,140,200,0.7)" }}>Система управления ремонтной мастерской</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(100,140,200,0.7)" }}>Отчёт сформирован</div>
          <div style={{ fontSize: 12, color: "rgba(180,215,255,0.8)" }}>28 апреля 2026 г.</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>Аналитика и отчёты</h2>
        <div className="flex items-center gap-3">
          <HotkeyHint keys="Alt+T" label="Таблица" />
          <HotkeyHint keys="Alt+G" label="График" />
          <div className="flex" style={{ border: "1px solid rgba(0,120,255,0.3)", borderRadius: 5, overflow: "hidden" }}>
            <button onClick={() => setView("chart")} style={{ fontFamily: "'Times New Roman', serif", fontSize: 12, padding: "5px 16px", color: view === "chart" ? "#fff" : "rgba(130,170,230,0.7)", background: view === "chart" ? "rgba(0,130,255,0.3)" : "transparent", borderRight: "1px solid rgba(0,120,255,0.3)" }}>График</button>
            <button onClick={() => setView("table")} style={{ fontFamily: "'Times New Roman', serif", fontSize: 12, padding: "5px 16px", color: view === "table" ? "#fff" : "rgba(130,170,230,0.7)", background: view === "table" ? "rgba(0,130,255,0.3)" : "transparent" }}>Таблица</button>
          </div>
        </div>
      </div>

      {view === "chart" ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="card-dark rounded-lg p-4">
            <h3 style={{ fontFamily: "'Times New Roman', serif", fontSize: 13, color: "var(--neon-cyan)", marginBottom: 16 }}>Выручка по месяцам (₽)</h3>
            <div className="flex items-end gap-4" style={{ height: 160 }}>
              {data.map(d => (
                <div key={d.month} className="flex flex-col items-center flex-1 gap-1">
                  <span style={{ fontSize: 10, color: "#60aaff" }}>{(d.revenue / 1000).toFixed(0)}к</span>
                  <div className="chart-bar w-full rounded-sm" style={{ height: `${(d.revenue / maxRev) * 130}px` }} />
                  <span style={{ fontSize: 10, color: "rgba(130,170,230,0.7)", textAlign: "center" }}>{d.month.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card-dark rounded-lg p-4">
            <h3 style={{ fontFamily: "'Times New Roman', serif", fontSize: 13, color: "var(--neon-cyan)", marginBottom: 16 }}>Кол-во заказов</h3>
            <div className="flex items-end gap-4" style={{ height: 160 }}>
              {data.map(d => (
                <div key={d.month} className="flex flex-col items-center flex-1 gap-1">
                  <span style={{ fontSize: 10, color: "#3ddc84" }}>{d.orders}</span>
                  <div className="chart-bar w-full rounded-sm" style={{ height: `${(d.orders / 41) * 130}px`, background: "linear-gradient(to top, rgba(0,180,100,0.5), rgba(60,220,130,0.7))", borderTopColor: "#3ddc84" }} />
                  <span style={{ fontSize: 10, color: "rgba(130,170,230,0.7)", textAlign: "center" }}>{d.month.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card-dark rounded-lg overflow-hidden">
          <table className="table-neon w-full">
            <thead>
              <tr><th>Месяц</th><th>Заказов</th><th>Выполнено</th><th>Выручка</th><th>Средний чек</th><th>Конверсия</th></tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.month}>
                  <td style={{ fontFamily: "'Times New Roman', serif", color: "rgba(180,215,255,0.9)" }}>{d.month}</td>
                  <td>{d.orders}</td>
                  <td style={{ color: "#3ddc84" }}>{d.done}</td>
                  <td style={{ color: "#60aaff", fontWeight: 600 }}>{d.revenue.toLocaleString("ru-RU")} ₽</td>
                  <td>{d.avg.toLocaleString("ru-RU")} ₽</td>
                  <td style={{ color: "#ffb830" }}>{Math.round((d.done / d.orders) * 100)}%</td>
                </tr>
              ))}
              <tr style={{ background: "rgba(0,100,255,0.07)", fontWeight: 700 }}>
                <td style={{ color: "var(--neon-cyan)" }}>Итого</td>
                <td style={{ color: "var(--neon-cyan)" }}>{data.reduce((s, d) => s + d.orders, 0)}</td>
                <td style={{ color: "#3ddc84" }}>{data.reduce((s, d) => s + d.done, 0)}</td>
                <td style={{ color: "#60aaff" }}>{data.reduce((s, d) => s + d.revenue, 0).toLocaleString("ru-RU")} ₽</td>
                <td>{Math.round(data.reduce((s, d) => s + d.avg, 0) / data.length).toLocaleString("ru-RU")} ₽</td>
                <td style={{ color: "#ffb830" }}>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ ЛИЧНЫЙ КАБИНЕТ ============
function Cabinet() {
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState<Order | null | "not_found">(null);
  const clientOrders = DEMO_ORDERS.filter(o => o.client === "Иванов А.П.");

  const handleTrack = () => {
    if (!trackId.trim()) return;
    const found = DEMO_ORDERS.find(o => o.id.toLowerCase() === trackId.trim().toLowerCase());
    setTrackResult(found || "not_found");
  };

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4" style={{ fontFamily: "'Times New Roman', serif", fontSize: 18, color: "var(--neon-cyan)", textShadow: "var(--neon-glow)" }}>Личный кабинет</h2>
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card-dark rounded-lg p-4">
          <h3 style={{ fontFamily: "'Times New Roman', serif", fontSize: 14, color: "var(--neon-cyan)", marginBottom: 12 }}>Отследить заказ</h3>
          <div className="flex gap-2 mb-4">
            <input className="input-neon flex-1" placeholder="Номер заказа (напр. ЗК-001)" value={trackId} onChange={e => setTrackId(e.target.value)} onKeyDown={e => e.key === "Enter" && handleTrack()} />
            <button className="neon-btn px-4 py-2 rounded" onClick={handleTrack}>Найти</button>
          </div>
          {trackResult === "not_found" && (
            <div style={{ fontSize: 12, color: "#ff8080", padding: "8px 12px", background: "rgba(255,50,50,0.08)", border: "1px solid rgba(255,50,50,0.25)", borderRadius: 5 }}>
              Заказ не найден. Проверьте номер и повторите поиск.
            </div>
          )}
          {trackResult && trackResult !== "not_found" && (
            <div style={{ padding: "10px 14px", background: "rgba(0,100,255,0.08)", border: "1px solid rgba(0,150,255,0.25)", borderRadius: 5 }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 13, color: "#60aaff", fontWeight: 700 }}>{trackResult.id}</span>
                <span className={`status-badge ${STATUS_CLASS[trackResult.status]}`}>{STATUS_LABELS[trackResult.status]}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(180,215,255,0.85)" }}>{trackResult.device}</div>
              <div style={{ fontSize: 11, color: "rgba(130,170,230,0.6)", marginTop: 4 }}>Срок: {trackResult.deadline} · Мастер: {trackResult.master}</div>
            </div>
          )}
        </div>

        <div className="card-dark rounded-lg p-4">
          <h3 style={{ fontFamily: "'Times New Roman', serif", fontSize: 14, color: "var(--neon-cyan)", marginBottom: 12 }}>
            История обращений <span style={{ fontSize: 11, color: "rgba(100,140,200,0.6)" }}>— Иванов А.П.</span>
          </h3>
          {clientOrders.map(o => (
            <div key={o.id} className="py-2" style={{ borderBottom: "1px solid rgba(0,100,255,0.1)" }}>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 12, color: "#60aaff" }}>{o.id}</span>
                <span className={`status-badge ${STATUS_CLASS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(180,215,255,0.85)" }}>{o.device} — {o.problem}</div>
              <div style={{ fontSize: 10, color: "rgba(100,140,200,0.6)", marginTop: 2 }}>{o.created} · {o.cost.toLocaleString("ru-RU")} ₽</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-dark rounded-lg p-4">
        <h3 style={{ fontFamily: "'Times New Roman', serif", fontSize: 14, color: "var(--neon-cyan)", marginBottom: 12 }}>История поломок и ремонтов</h3>
        <div className="card-dark rounded-lg overflow-hidden" style={{ border: "none" }}>
          <table className="table-neon w-full">
            <thead>
              <tr><th>Заказ</th><th>Клиент</th><th>Устройство</th><th>Неисправность</th><th>Дата</th><th>Итог</th></tr>
            </thead>
            <tbody>
              {DEMO_ORDERS.map(o => (
                <tr key={o.id}>
                  <td style={{ color: "#60aaff" }}>{o.id}</td>
                  <td>{o.client}</td>
                  <td>{o.device}</td>
                  <td>{o.problem}</td>
                  <td>{o.created}</td>
                  <td><span className={`status-badge ${STATUS_CLASS[o.status]}`}>{STATUS_LABELS[o.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ ГЛАВНЫЙ КОМПОНЕНТ ============
const NAV: { key: Section; label: string; icon: string; hotkey: string }[] = [
  { key: "dashboard", label: "Главная", icon: "LayoutDashboard", hotkey: "Alt+1" },
  { key: "orders", label: "Заказы", icon: "ClipboardList", hotkey: "Alt+2" },
  { key: "staff", label: "Сотрудники", icon: "Users", hotkey: "Alt+3" },
  { key: "parts", label: "Запчасти", icon: "Package", hotkey: "Alt+4" },
  { key: "schedule", label: "Расписание", icon: "CalendarDays", hotkey: "Alt+5" },
  { key: "reports", label: "Отчёты", icon: "BarChart2", hotkey: "Alt+6" },
  { key: "cabinet", label: "Личный кабинет", icon: "User", hotkey: "Alt+7" },
];

export default function App() {
  const [section, setSection] = useState<Section>("dashboard");
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [error, setError] = useState<ErrorNotification | null>(null);

  const showError = useCallback((key: string) => {
    setError(ERROR_MESSAGES[key] || ERROR_MESSAGES.SAVE_ERROR);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const map: Record<string, Section> = {
        "1": "dashboard", "2": "orders", "3": "staff",
        "4": "parts", "5": "schedule", "6": "reports", "7": "cabinet",
      };
      if (map[e.key]) { e.preventDefault(); setSection(map[e.key]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "hsl(220, 40%, 4%)" }}>
      <header style={{ borderBottom: "1px solid rgba(0,120,255,0.2)", background: "rgba(2,8,22,0.98)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, rgba(0,100,255,0.4), rgba(0,200,255,0.3))", borderRadius: 7, border: "1px solid rgba(0,180,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--neon-glow)" }}>
              <Icon name="Wrench" size={18} style={{ color: "var(--neon-cyan)" }} />
            </div>
            <div>
              <div className="logo-header" style={{ fontSize: 17 }}>РемМастер</div>
              <div style={{ fontSize: 9, color: "rgba(80,120,180,0.7)", letterSpacing: "0.1em" }}>СИСТЕМА УПРАВЛЕНИЯ МАСТЕРСКОЙ</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 10, color: "rgba(80,120,180,0.6)" }}>28 апр. 2026</span>
            <div style={{ width: 1, height: 20, background: "rgba(0,100,255,0.2)" }} />
            <div className="flex items-center gap-2" style={{ cursor: "pointer" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,100,255,0.2)", border: "1px solid rgba(0,150,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="User" size={14} style={{ color: "#60aaff" }} />
              </div>
              <span style={{ fontSize: 11, color: "rgba(130,170,220,0.8)" }}>Администратор</span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        <aside style={{ width: 210, background: "rgba(2,7,20,0.97)", borderRight: "1px solid rgba(0,80,200,0.15)", display: "flex", flexDirection: "column", padding: "20px 0", position: "sticky", top: 56, height: "calc(100vh - 56px)", overflowY: "auto" }}>
          {NAV.map(n => (
            <button
              key={n.key}
              onClick={() => setSection(n.key)}
              title={n.hotkey}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 20px",
                fontFamily: "'Times New Roman', serif",
                fontSize: 13,
                color: section === n.key ? "#fff" : "rgba(120,160,220,0.75)",
                background: section === n.key ? "linear-gradient(90deg, rgba(0,130,255,0.2), transparent)" : "transparent",
                borderLeft: section === n.key ? "2px solid var(--neon-cyan)" : "2px solid transparent",
                textAlign: "left", width: "100%", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Icon name={n.icon as string} size={15} style={{ color: section === n.key ? "var(--neon-cyan)" : "rgba(80,120,200,0.6)", flexShrink: 0 }} />
              {n.label}
            </button>
          ))}

          <div style={{ marginTop: "auto", padding: "16px 20px 4px", borderTop: "1px solid rgba(0,80,200,0.1)" }}>
            <div style={{ fontSize: 10, color: "rgba(60,100,160,0.6)", marginBottom: 6 }}>Горячие клавиши</div>
            {NAV.map(n => (
              <div key={n.key} className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 10, color: "rgba(80,120,180,0.55)" }}>{n.label}</span>
                <span className="kbd-hint">{n.hotkey}</span>
              </div>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1, padding: "24px 28px", overflowX: "hidden" }}>
          {section === "dashboard" && <Dashboard orders={orders} />}
          {section === "orders" && <Orders orders={orders} setOrders={setOrders} showError={showError} />}
          {section === "staff" && <StaffSection />}
          {section === "parts" && <PartsSection showError={showError} />}
          {section === "schedule" && <ScheduleSection />}
          {section === "reports" && <Reports />}
          {section === "cabinet" && <Cabinet />}
        </main>
      </div>

      {error && <ErrorToast err={error} onClose={() => setError(null)} />}
    </div>
  );
}