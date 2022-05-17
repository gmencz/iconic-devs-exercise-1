import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

interface ItemOffer {
  // The amount of items for the offer to be applicable.
  amount: number;

  // The price of the offer (for example, buy 3 of item "A" for 130).
  price: number;
}

export interface Item {
  // The equivalent of an "SKU" for this project.
  letter: string;

  // The name of the item (for example, Adidas Pants).
  name: string;

  // The URL pointing to an image of the item if available.
  previewURL?: string;

  // The price of the item itself.
  price: number;

  // The current offer if any of the item.
  offer?: ItemOffer;
}

export const loader: LoaderFunction = async () => {
  const response = await fetch(`${process.env.API}/items`);
  const data = await response.json();
  return json(data);
};

interface LoaderData {
  items: Item[];
}

export default function Index() {
  const { items } = useLoaderData<LoaderData>();

  return (
    <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {items.map((item) => (
        <Link key={item.letter} to={`./items/${item.letter}`} className="group">
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
            <img
              src={item.previewURL}
              alt="No Preview Available"
              className="w-full h-full object-center object-cover group-hover:opacity-75"
            />
          </div>
          <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
          <p className="mt-1 text-lg font-medium text-gray-900">
            {item.price} €
          </p>
        </Link>
      ))}
    </div>
  );
}
