import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ItemOverview } from "~/components/item-overview";
import type { Item } from "~/types";

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
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Items</h2>
      <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {items.map((item) => (
          <ItemOverview key={item.letter} item={item} />
        ))}
      </div>
    </div>
  );
}
