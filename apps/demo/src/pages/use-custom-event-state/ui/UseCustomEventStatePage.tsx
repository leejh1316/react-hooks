import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

// ─── Demo 1: 독립 컴포넌트 간 상태 공유 ────────────────────────────────────────

function CounterCard({ label }: { label: string }) {
  const [count, setCount] = useCustomEventState("shared-counter", 0);

  return (
    <div className="flex-1 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center gap-3">
      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</div>
      <div className="text-4xl font-bold font-mono text-indigo-500">{count}</div>
      <div className="flex gap-2">
        <Button size="sm" variant="cancel" onClick={() => setCount((c) => c - 1)}>
          −
        </Button>
        <Button size="sm" onClick={() => setCount((c) => c + 1)}>
          +
        </Button>
        <Button size="sm" variant="danger" onClick={() => setCount(0)}>
          리셋
        </Button>
      </div>
    </div>
  );
}

function SharedCounterDemo() {
  return (
    <DemoSection
      title="독립 컴포넌트 간 상태 공유"
      description='세 CounterCard는 서로 독립된 컴포넌트입니다. 같은 key "shared-counter"로 CustomEvent 채널을 구독하므로 어느 카드에서 값을 바꿔도 나머지 두 카드가 즉시 업데이트됩니다. props 전달이나 Context 없이도 동작합니다.'
    >
      <div className="flex gap-3 mb-4">
        <CounterCard label="카드 A" />
        <CounterCard label="카드 B" />
        <CounterCard label="카드 C" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        세 컴포넌트 모두{" "}
        <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-[0.75em]">"shared-counter"</code> 키로
        같은 채널을 구독합니다. 어떤 카드에서 dispatch해도 나머지가 동시에 렌더링됩니다.
      </p>
    </DemoSection>
  );
}

// ─── Demo 2: 장바구니 시뮬레이션 ───────────────────────────────────────────────

interface CartItem {
  id: number;
  name: string;
  qty: number;
}

const PRODUCTS = [
  { id: 1, name: "React 핸즈온 북", price: 28000, emoji: "📗" },
  { id: 2, name: "기계식 키보드", price: 120000, emoji: "⌨️" },
  { id: 3, name: "4K 웹캠", price: 89000, emoji: "📷" },
  { id: 4, name: "노이즈 캔슬링 이어폰", price: 65000, emoji: "🎧" },
];

const PRICE_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.price]));

function CartBadge() {
  const [cart] = useCustomEventState<CartItem[]>("cart-items", []);
  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-lg">
      <span className="text-lg leading-none">🛒</span>
      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">장바구니</span>
      {total > 0 ? (
        <span className="w-5 h-5 bg-indigo-500 text-white text-[0.65rem] font-bold rounded-full flex items-center justify-center">
          {total > 9 ? "9+" : total}
        </span>
      ) : (
        <span className="text-xs text-indigo-400">비어있음</span>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: (typeof PRODUCTS)[number] }) {
  const [cart, setCart] = useCustomEventState<CartItem[]>("cart-items", []);
  const inCart = cart.find((i) => i.id === product.id);

  const handleAdd = () => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: product.id, name: product.name, qty: 1 }];
    });
  };

  const handleRemove = () => {
    setCart((prev) => prev.filter((i) => i.id !== product.id));
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col gap-2">
      <div className="text-2xl leading-none">{product.emoji}</div>
      <div className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">{product.name}</div>
      <div className="text-xs font-mono text-gray-400">{product.price.toLocaleString()}원</div>
      <div className="flex items-center gap-2 mt-auto pt-1">
        {inCart ? (
          <>
            <span className="text-xs text-indigo-500 font-semibold font-mono">{inCart.qty}개 담김</span>
            <Button size="sm" variant="cancel" onClick={handleAdd}>
              +
            </Button>
            <Button size="sm" variant="danger" onClick={handleRemove}>
              제거
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={handleAdd}>
            담기
          </Button>
        )}
      </div>
    </div>
  );
}

function CartSummary() {
  const [cart, setCart] = useCustomEventState<CartItem[]>("cart-items", []);

  if (cart.length === 0) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-400">
        장바구니가 비어있습니다
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.qty * PRICE_MAP[item.id], 0);

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">장바구니 요약</div>
      <div className="space-y-2 mb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {item.name} × {item.qty}
            </span>
            <span className="font-mono text-indigo-500">{(PRICE_MAP[item.id] * item.qty).toLocaleString()}원</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">합계</span>
        <span className="font-mono font-bold text-indigo-500">{total.toLocaleString()}원</span>
      </div>
      <Button variant="danger" fullWidth className="mt-3" onClick={() => setCart([])}>
        장바구니 비우기
      </Button>
    </div>
  );
}

function CartDemo() {
  return (
    <DemoSection
      title="장바구니 — 컴포넌트 트리를 가로지르는 상태 공유"
      description='CartBadge, ProductCard, CartSummary는 별도의 독립 컴포넌트입니다. 모두 key "cart-items"를 통해 같은 상태를 구독하므로 어느 ProductCard에서 담거나 제거해도 배지와 요약이 즉시 반영됩니다.'
    >
      <div className="mb-4">
        <CartBadge />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <CartSummary />
    </DemoSection>
  );
}

// ─── Demo 3: 글로벌 설정 브로드캐스트 ──────────────────────────────────────────

type FontSize = "sm" | "md" | "lg";

const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const FONT_SIZE_LABELS: Record<FontSize, string> = { sm: "작게", md: "보통", lg: "크게" };

const ARTICLES = [
  {
    title: "useCustomEventState란?",
    body: "window의 CustomEvent API를 활용해 key별로 독립적인 pub-sub 채널을 만들고, 같은 key를 사용하는 모든 컴포넌트가 상태를 공유하는 훅입니다.",
  },
  {
    title: "언제 쓰면 좋을까?",
    body: "전역 상태 라이브러리 없이 트리 곳곳에 흩어진 컴포넌트들이 하나의 상태를 읽고 써야 할 때 유용합니다. props 드릴링이나 Context 설정 없이 바로 연결할 수 있습니다.",
  },
  {
    title: "주의사항",
    body: "상태가 window 이벤트를 통해 전파되므로 같은 key를 사용하는 모든 컴포넌트가 영향을 받습니다. key 충돌을 방지하려면 의미 있는 접두사를 붙이세요.",
  },
];

function ArticleCard({ title, body }: { title: string; body: string }) {
  const [fontSize] = useCustomEventState<FontSize>("article-font-size", "md");

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-150">
      <div className={`font-semibold text-gray-800 dark:text-gray-100 mb-1 ${FONT_SIZE_MAP[fontSize]}`}>{title}</div>
      <p className={`text-gray-500 dark:text-gray-400 leading-relaxed m-0 ${FONT_SIZE_MAP[fontSize]}`}>{body}</p>
    </div>
  );
}

function FontSizeControl() {
  const [fontSize, setFontSize] = useCustomEventState<FontSize>("article-font-size", "md");

  return (
    <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide shrink-0">글자 크기</span>
      <div className="flex gap-1.5">
        {(["sm", "md", "lg"] as FontSize[]).map((size) => (
          <Button
            key={size}
            size="sm"
            variant={fontSize === size ? "primary" : "cancel"}
            onClick={() => setFontSize(size)}
          >
            {FONT_SIZE_LABELS[size]}
          </Button>
        ))}
      </div>
      <span className="ml-auto text-xs font-mono text-gray-400">{fontSize}</span>
    </div>
  );
}

function GlobalBroadcastDemo() {
  return (
    <DemoSection
      title="글로벌 설정 브로드캐스트"
      description='FontSizeControl이 "article-font-size" key로 상태를 dispatch하면, 해당 key를 구독 중인 모든 ArticleCard가 동시에 반응합니다. 설정 컴포넌트와 콘텐츠 컴포넌트가 완전히 분리되어 있어도 props 없이 연결할 수 있습니다.'
    >
      <FontSizeControl />
      <div className="space-y-3">
        {ARTICLES.map((a) => (
          <ArticleCard key={a.title} title={a.title} body={a.body} />
        ))}
      </div>
    </DemoSection>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export function UseCustomEventStatePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-custom-event-state"
        description="CustomEvent API를 이용해 key별 pub-sub 채널을 만들고, 같은 key를 사용하는 모든 컴포넌트가 상태를 공유합니다. props 전달·Context 없이 트리 어디서나 상태를 읽고 업데이트할 수 있습니다."
      />
      <SharedCounterDemo />
      <CartDemo />
      <GlobalBroadcastDemo />
    </div>
  );
}
