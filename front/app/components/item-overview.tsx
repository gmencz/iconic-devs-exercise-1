import { Link } from "@remix-run/react";
import type { Item } from "~/types";

interface Props {
  item: Item;
}

export function ItemOverview({ item }: Props) {
  return (
    <Link
      to={`./items/${item.letter}`}
      className="group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-lg"
    >
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <img
          src={item.previewURL}
          alt="No Preview Available"
          className="w-full h-full object-center object-cover group-hover:opacity-75"
        />
      </div>

      <div className="p-1">
        <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">{item.price} €</p>
      </div>
    </Link>
  );
}
