import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import type { Item } from "..";

export const loader: LoaderFunction = async ({ params }) => {
  const { letter } = params;
  const response = await fetch(`${process.env.API}/items/${letter}`);

  if (response.status === 404) {
    throw new Response("Not Found", { status: 404 });
  }

  const data = await response.json();
  return json(data);
};

export function CatchBoundary() {
  const caught = useCatch();

  switch (caught.status) {
    case 404:
      return (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Item not found
          </h1>
        </>
      );

    default:
      return (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Something went wrong with the item
          </h1>
        </>
      );
  }
}

interface LoaderData {
  item: Item;
}

export default function ItemView() {
  const { item } = useLoaderData<LoaderData>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10">
      <div className="relative z-10">
        <h2 className="text-2xl text-gray-900 font-extrabold tracking-tight sm:text-3xl">
          {item.name}
        </h2>
        <div className="flex items-center divide-x">
          <p className="mt-4 text-lg font-medium pr-4">{item.price} €</p>

          {item.offer ? (
            <button className="mt-4 pl-4 flex items-center space-x-3 cursor-pointer group">
              <span className="bg-red-500 font-bold text-white p-2 rounded text-xs group-hover:bg-red-400">
                LIMITED OFFER
              </span>

              <span className="font-medium underline group-hover:opacity-60">
                {item.offer?.amount} for only {item.offer?.price} €
              </span>
            </button>
          ) : null}
        </div>

        <button className="mt-40 bg-red-500 p-4 text-white rounded font-bold">
          Add to cart
        </button>
      </div>

      <img
        src={item.previewURL}
        alt="Preview not available"
        className="w-full h-full object-center object-cover group-hover:opacity-75 max-w-xl -mt-20 lg:-mt-28"
      />
    </div>
  );
}
