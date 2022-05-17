import { ShoppingCartIcon } from "@heroicons/react/outline";
import { Link } from "@remix-run/react";

export const Header = () => {
  return (
    <div className="max-w-7xl mx-auto lg:divide-y lg:divide-gray-200 border-b-gray-300 border-b">
      <div className="relative h-16 flex justify-between items-center lg:max-w-7xl lg:px-8 max-w-2xl w-full mx-auto px-4 sm:px-6">
        <Link
          to="/"
          className="font-bold text-2xl text-red-500 hover:text-red-400 font-mono"
        >
          SHOP
        </Link>

        <div className="lg:relative lg:z-10 lg:flex lg:items-center">
          <button
            type="button"
            className="flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <span className="sr-only">View notifications</span>
            <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
