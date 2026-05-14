import { CartItem } from "@/types";

const getCartKey = () => {
  if (typeof window === "undefined") return "cart";

  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user ? `cart_${user._id}` : "cart_guest";
};

// 🔥 EMIT EVENT
const emitCartUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

export const getCart = (): CartItem[] => {
  const key = getCartKey();
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const saveCart = (cart: CartItem[]) => {
  const key = getCartKey();
  localStorage.setItem(key, JSON.stringify(cart));
  emitCartUpdate();
};

export const addToCart = (item: any) => {
  const key = getCartKey();
  const cart = JSON.parse(localStorage.getItem(key) || "[]");

  const existing = cart.find((i: any) => i.product === item.product);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    });
  }

  localStorage.setItem(key, JSON.stringify(cart));
  emitCartUpdate(); // ✅
};

export const updateQuantity = (productId: string, amount: number) => {
  const key = getCartKey();
  const cart = JSON.parse(localStorage.getItem(key) || "[]");

  const updated = cart.map((item: any) => {
    if (item.product === productId) {
      return {
        ...item,
        quantity: Math.max(1, item.quantity + amount),
      };
    }
    return item;
  });

  localStorage.setItem(key, JSON.stringify(updated));
  emitCartUpdate(); // ✅
  return updated;
};

export const removeFromCart = (productId: string) => {
  const key = getCartKey();
  const cart = JSON.parse(localStorage.getItem(key) || "[]");

  const updated = cart.filter((item: any) => item.product !== productId);

  localStorage.setItem(key, JSON.stringify(updated));
  emitCartUpdate(); // ✅
  return updated;
};

export const mergeCartAfterLogin = (userId: string) => {
  const guestCart = JSON.parse(localStorage.getItem("cart_guest") || "[]");
  const userKey = `cart_${userId}`;
  const userCart = JSON.parse(localStorage.getItem(userKey) || "[]");

  const merged = [...userCart];

  guestCart.forEach((gItem: any) => {
    const existing = merged.find((i) => i.product === gItem.product);

    if (existing) {
      existing.quantity += gItem.quantity;
    } else {
      merged.push(gItem);
    }
  });

  localStorage.setItem(userKey, JSON.stringify(merged));
  localStorage.removeItem("cart_guest");

  emitCartUpdate(); // ✅ VERY IMPORTANT

  return merged;
};