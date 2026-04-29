import { create } from "zustand";
import { Coupon, CouponResponseSchema, Product, ShoppingCart } from "./schemas";
import { devtools } from "zustand/middleware";

interface Store {
    total: number;
    discount: number;
    contents: ShoppingCart;
    coupon: Coupon;
    addToCart: (product: Product) => void;
    updateQuantity: (id: Product['id'], quantity: number) => void;
    removeFromCart: (id: Product['id']) => void;
    calculateTotal: () => void;
    applyCoupon: (couponName: string) => Promise<void>;
    applyDiscount: () => void;
    clearOrder: () => void;
}

const initialState = {
    total: 0,
    discount: 0,
    contents: [],
    coupon: {
        percentage: 0,
        name: '',
        message: '',
        expirationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
    },
}

export const useStore = create<Store>()(devtools((set, get) => ({
    ...initialState,
    addToCart: (product) => {
        const { id: productId, categoryId, ...data } = product;
        let contents: ShoppingCart = [];

        const duplicated = get().contents.findIndex(item => item.productId === productId);

        if (duplicated >= 0) {

            if (get().contents[duplicated].quantity >= get().contents[duplicated].inventory) return;

            contents = get().contents.map(item => item.productId === product.id ? {
                ...item,
                quantity: item.quantity + 1
            } : item)
        } else {
            contents = [...get().contents, { // get the current contents of the cart and add the new product
                ...data,
                productId,
                quantity: 1
            }];
        }

        set(() => ({
            contents,
        }));
        get().calculateTotal();
    },
    updateQuantity: (id, quantity) => {
        set((state) => ({
            contents: state.contents.map(item => item.productId === id ? { ...item, quantity } : item)
        }));
        get().calculateTotal();
    },
    removeFromCart: (id) => {
        set((state) => ({
            contents: state.contents.filter(item => item.productId !== id)
        }));

        if (!get().contents.length) return get().clearOrder();
        get().calculateTotal();
    },
    calculateTotal: () => {
        set((state) => ({
            total: state.contents.reduce((total, item) => total + (item.quantity * item.price), 0)
        }));

        if (get().coupon.percentage) return get().applyDiscount();
    },
    applyCoupon: async (couponName) => {
        const req = await fetch('/coupons/api', {
            method: 'POST',
            body: JSON.stringify({
                coupon_name: couponName
            })
        });

        const res = await req.json();
        const coupon = CouponResponseSchema.parse(res);
        set(() => ({
            coupon
        }));

        if (coupon.percentage) return get().applyDiscount();
    },
    applyDiscount: () => {
        const subtotalAmount = get().contents.reduce((total, item) => total + (item.quantity * item.price), 0);
        const discount = (get().coupon.percentage / 100) * subtotalAmount;
        const total = subtotalAmount - discount;

        set(() => ({
            discount,
            total
        }));
    },
    clearOrder: () => {
        set(() => ({
            ...initialState
        }));
    }
})));