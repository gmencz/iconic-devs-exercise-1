import { ShoppingCartIcon } from "@heroicons/react/outline";
import { Link } from "@remix-run/react";
import { useState } from "react";
import type { ShoppingCart } from "./shopping-cart";
import { ShoppingCartSlideOver } from "./shopping-cart";

interface Props {
  shoppingCart: ShoppingCart;
}

export const Header = ({ shoppingCart }: Props) => {
  const [showShoppingCart, setShowShoppingCart] = useState(false);

  return (
    <div className="max-w-7xl mx-auto lg:divide-y lg:divide-gray-200 border-b-gray-300 border-b">
      <div className="relative h-16 flex justify-between items-center lg:max-w-7xl lg:px-8 max-w-2xl w-full mx-auto px-4 sm:px-6">
        <Link
          to="/"
          className="font-bold text-2xl text-red-500 hover:text-red-400 font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
        >
          SHOP
        </Link>

        <button
          onClick={() => setShowShoppingCart(true)}
          className="lg:relative lg:z-10 lg:flex lg:items-center relative group focus:outline-none"
        >
          <span className="sr-only">View shopping cart</span>
          <div className="flex-shrink-0 bg-white rounded-full p-1 text-gray-400 group-hover:text-gray-500 group-focus:outline-none group-focus:ring-2 group-focus:ring-offset-2 group-focus:ring-red-500">
            <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
          </div>

          {shoppingCart.items.length > 0 ? (
            <span className="absolute bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center -top-1.5 -right-1.5">
              {shoppingCart.items.length}
            </span>
          ) : null}
        </button>
      </div>

      <ShoppingCartSlideOver
        setShow={setShowShoppingCart}
        show={showShoppingCart}
        shoppingCart={shoppingCart}
      />
    </div>
  );
};
