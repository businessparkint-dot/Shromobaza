"use client";

import { useMemo, useState } from "react";
import {
  Apple,
  ArrowRight,
  Beef,
  CakeSlice,
  Check,
  ChevronRight,
  Coffee,
  Fish,
  Heart,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Target,
  Truck,
  Utensils,
  X,
} from "lucide-react";
type Product = {
  id: number;
  name: string;
  category: string;
  seller: string;
  location: string;
  price: number;
  unit: string;
  rating: number;
  emoji: string;
  badge?: string;
};

const categories = [
  { id: "all", name: "সব খাবার", icon: Utensils },
  { id: "vegetable", name: "সবজি", icon: Apple },
  { id: "fruit", name: "ফলমূল", icon: Apple },
  { id: "fish", name: "মাছ", icon: Fish },
  { id: "meat", name: "মাংস", icon: Beef },
  { id: "bakery", name: "বেকারি", icon: CakeSlice },
  { id: "grocery", name: "গ্রোসারি", icon: ShoppingBag },
  { id: "drinks", name: "পানীয়", icon: Coffee },
];

const products: Product[] = [
  {
    id: 1,
    name: "Fresh Tomato",
    category: "vegetable",
    seller: "Green Fresh Farm",
    location: "ঢাকা",
    price: 80,
    unit: "কেজি",
    rating: 4.8,
    emoji: "🍅",
    badge: "Fresh",
  },
  {
    id: 2,
    name: "Premium Mango",
    category: "fruit",
    seller: "Rajshahi Fruit House",
    location: "রাজশাহী",
    price: 180,
    unit: "কেজি",
    rating: 4.9,
    emoji: "🥭",
    badge: "Popular",
  },
  {
    id: 3,
    name: "Fresh Hilsa",
    category: "fish",
    seller: "River Fish BD",
    location: "বরিশাল",
    price: 950,
    unit: "কেজি",
    rating: 4.7,
    emoji: "🐟",
    badge: "Premium",
  },
  {
    id: 4,
    name: "Fresh Chicken",
    category: "meat",
    seller: "Pure Meat Shop",
    location: "ঢাকা",
    price: 320,
    unit: "কেজি",
    rating: 4.6,
    emoji: "🍗",
    badge: "Fresh",
  },
  {
    id: 5,
    name: "Milk Bread",
    category: "bakery",
    seller: "Daily Bake",
    location: "চট্টগ্রাম",
    price: 90,
    unit: "প্যাকেট",
    rating: 4.7,
    emoji: "🍞",
  },
  {
    id: 6,
    name: "Organic Rice",
    category: "grocery",
    seller: "Bangla Agro",
    location: "দিনাজপুর",
    price: 95,
    unit: "কেজি",
    rating: 4.8,
    emoji: "🍚",
    badge: "Organic",
  },
  {
    id: 7,
    name: "Fresh Milk",
    category: "drinks",
    seller: "Pure Dairy",
    location: "সাভার",
    price: 85,
    unit: "লিটার",
    rating: 4.9,
    emoji: "🥛",
    badge: "Fresh",
  },
  {
    id: 8,
    name: "Green Coconut",
    category: "fruit",
    seller: "Coastal Fresh",
    location: "খুলনা",
    price: 70,
    unit: "টি",
    rating: 4.7,
    emoji: "🥥",
  },
];

type CartItem = {
  product: Product;
  quantity: number;
};

export default function FoodMarketPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showBuyRequest, setShowBuyRequest] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [requestSent, setRequestSent] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "all" ||
        product.category === activeCategory;

      const searchMatch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const increaseQuantity = (productId: number) => {
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const submitBuyRequest = () => {
    setRequestSent(true);

    setTimeout(() => {
      setShowBuyRequest(false);
      setRequestSent(false);
    }, 1800);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.14),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                <Utensils className="h-4 w-4" />
                Food Market
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
                Fresh Food,
                <br />
                <span className="text-emerald-400">
                  Direct From Sellers.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                কৃষক, food seller, shop, restaurant এবং buyer—সবাইকে
                এক জায়গায় যুক্ত করার জন্য Shromobazar Food Market।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-black text-emerald-950 transition hover:bg-emerald-300"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Browse Food
                </button>

                <button
                  onClick={() => setShowBuyRequest(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
                >
                  <Search className="h-5 w-5" />
                  আমি কিনতে চাই
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-4">
                <Stat
                  icon="🥬"
                  value="500+"
                  label="Fresh Products"
                />
                <Stat
                  icon="🏪"
                  value="120+"
                  label="Food Sellers"
                />
                <Stat
                  icon="👨‍🌾"
                  value="80+"
                  label="Farmers"
                />
                <Stat
                  icon="🚚"
                  value="24/7"
                  label="Market Access"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="খাবার, পণ্য, Seller বা location খুঁজুন..."
              className="w-full rounded-xl bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
              Food Marketplace
            </p>

            <h2 className="mt-1 text-3xl font-black">
              Fresh Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredProducts.length}টি product পাওয়া গেছে
            </p>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
            {cartCount > 0 && (
              <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-xs font-black text-emerald-950">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                favorite={favorites.includes(product.id)}
                onFavorite={() => toggleFavorite(product.id)}
                onAdd={() => addToCart(product)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <Search className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-xl font-black">
              কোনো product পাওয়া যায়নি
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              অন্য keyword অথবা category দিয়ে চেষ্টা করুন।
            </p>
          </div>
        )}
      </section>

      {/* SELLER CTA */}
      <section className="border-y border-emerald-100 bg-emerald-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <SellerFeature
              icon={<Store />}
              title="Open Your Food Shop"
              text="নিজের food business বা shop online-এ showcase করুন।"
            />

            <SellerFeature
              icon={<Truck />}
              title="Sell & Deliver"
              text="নিজের products customers-এর কাছে পৌঁছে দিন।"
            />

            <SellerFeature
              icon={<Sparkles />}
              title="Premium Visibility"
              text="Subscription-এর মাধ্যমে shop ও products বেশি মানুষের সামনে আনুন।"
            />
          </div>
        </div>
      </section>

      {/* BUY REQUEST CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-400/10 px-4 py-2 text-sm font-bold text-orange-300">
                <Target className="h-4 w-4" />
                Buyer Request
              </div>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                বাজারে নেই?
                <br />
                <span className="text-orange-400">
                  আপনি কী কিনতে চান বলুন।
                </span>
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                কোনো নির্দিষ্ট food product খুঁজে না পেলে buyer request
                তৈরি করুন। ভবিষ্যতে sellers আপনার request দেখে offer দিতে
                পারবে।
              </p>
            </div>

            <button
              onClick={() => setShowBuyRequest(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-400 px-6 py-4 font-black text-slate-950 hover:bg-orange-300"
            >
              <Plus className="h-5 w-5" />
              আমি কিনতে চাই
            </button>
          </div>
        </div>
      </section>

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h3 className="text-xl font-black">Your Cart</h3>
                <p className="text-sm text-slate-500">
                  {cartCount}টি item
                </p>
              </div>

              <button
                onClick={() => setShowCart(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-4 font-bold text-slate-600">
                    Cart এখনো খালি।
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 rounded-2xl border border-slate-200 p-3"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-3xl">
                        {item.product.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-black">{item.product.name}</p>

                        <p className="mt-1 text-sm text-slate-500">
                          ৳{item.product.price} / {item.product.unit}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() =>
                              decreaseQuantity(item.product.id)
                            }
                            className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="min-w-6 text-center text-sm font-black">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.product.id)
                            }
                            className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="font-black text-emerald-700">
                        ৳{item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-200 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-bold text-slate-500">
                    Total
                  </span>

                  <span className="text-2xl font-black">
                    ৳{cartTotal}
                  </span>
                </div>

                <button
                  onClick={() =>
                    window.alert(
                      "Order flow ready. পরবর্তী ধাপে payment ও delivery system যুক্ত করা যাবে।"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-black text-white hover:bg-emerald-700"
                >
                  Proceed to Order
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BUY REQUEST MODAL */}
      {showBuyRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-orange-500">
                  Buyer Request
                </p>

                <h3 className="mt-1 text-xl font-black">
                  আমি কী কিনতে চাই?
                </h3>
              </div>

              <button
                onClick={() => setShowBuyRequest(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {requestSent ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Request Submitted
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    আপনার buyer request গ্রহণ করা হয়েছে।
                  </p>
                </div>
              ) : (
                <>
                  <FormInput
                    label="Product Name"
                    placeholder="যেমন: দেশি গরুর মাংস"
                  />

                  <FormInput
                    label="Quantity"
                    placeholder="যেমন: ৫ কেজি"
                  />

                  <FormInput
                    label="Location"
                    placeholder="আপনার এলাকা"
                  />

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                      Additional Details
                    </span>

                    <textarea
                      rows={4}
                      placeholder="আপনি কী ধরনের product চান?"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <button
                    onClick={submitBuyRequest}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-black text-white hover:bg-orange-600"
                  >
                    <Search className="h-5 w-5" />
                    Submit Buy Request
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ProductCard({
  product,
  favorite,
  onFavorite,
  onAdd,
}: {
  product: Product;
  favorite: boolean;
  onFavorite: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-orange-50">
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 shadow-sm">
            {product.badge}
          </span>
        )}

        <button
          onClick={onFavorite}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm transition hover:scale-105"
          aria-label="Favorite"
        >
          <Heart
            className={`h-5 w-5 ${
              favorite
                ? "fill-rose-500 text-rose-500"
                : "text-slate-400"
            }`}
          />
        </button>

        <span className="text-7xl transition duration-300 group-hover:scale-110">
          {product.emoji}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-black text-slate-900">
              {product.name}
            </h3>

            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <Store className="h-3.5 w-3.5" />
              {product.seller}
            </div>
          </div>

          <span className="flex shrink-0 items-center gap-1 text-xs font-black text-amber-600">
            ★ {product.rating}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {product.location}
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-2xl font-black text-emerald-700">
              ৳{product.price}
            </span>

            <span className="ml-1 text-xs text-slate-500">
              / {product.unit}
            </span>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-black text-white transition hover:bg-emerald-700"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SellerFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

      <button className="mt-5 inline-flex items-center gap-1 text-sm font-black text-emerald-700">
        Explore
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function FormInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <input
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}