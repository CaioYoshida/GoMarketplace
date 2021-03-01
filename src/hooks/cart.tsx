import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // getting cart async storage data
      const currentProductCart = await AsyncStorage.getItem(
        '@GoMarketplace:cart',
      );

      if (currentProductCart) {
        setProducts(JSON.parse(currentProductCart));
      } else {
        setProducts([]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    const currentProductCart = await AsyncStorage.getItem(
      '@GoMarketplace:cart',
    );

    if (currentProductCart) {
      const currentProductCartParsed: Array<Product> = JSON.parse(
        currentProductCart,
      );

      const productIsAlredyInCart = currentProductCartParsed.find(
        item => item.id === product.id,
      );

      if (productIsAlredyInCart) {
        productIsAlredyInCart.quantity += 1;
      } else {
        currentProductCartParsed.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(currentProductCartParsed),
      );

      setProducts(currentProductCartParsed);
    } else {
      const productCart = [];

      productCart.push({ ...product, quantity: 1 });

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(productCart),
      );

      setProducts(productCart);
    }
  }, []);

  const increment = useCallback(async (id: string) => {
    const currentProductCart = await AsyncStorage.getItem(
      '@GoMarketplace:cart',
    );

    if (currentProductCart) {
      const currentProductCartParsed: Array<Product> = JSON.parse(
        currentProductCart,
      );

      const productToIncrement = currentProductCartParsed.find(
        product => product.id === id,
      );

      if (productToIncrement) {
        productToIncrement.quantity += 1;
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(currentProductCartParsed),
      );

      setProducts(currentProductCartParsed);
    }
  }, []);

  const decrement = useCallback(async id => {
    const currentProductCart = await AsyncStorage.getItem(
      '@GoMarketplace:cart',
    );

    if (currentProductCart) {
      const currentProductCartParsed: Array<Product> = JSON.parse(
        currentProductCart,
      );

      const productToDecrement = currentProductCartParsed.find(
        product => product.id === id,
      );

      if (productToDecrement && productToDecrement.quantity >= 2) {
        productToDecrement.quantity -= 1;
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(currentProductCartParsed),
      );

      setProducts(currentProductCartParsed);
    }
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
