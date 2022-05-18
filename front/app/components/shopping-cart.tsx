import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Link } from "@remix-run/react";
import { Fragment } from "react";
import type { Item } from "~/routes";

interface Props {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  shoppingCart: ShoppingCart;
}

export interface ShoppingCart {
  totalPrice: number;
  items: {
    details: Item;
    amount: number;
  }[];
}

export const ShoppingCartSlideOver = ({
  show,
  setShow,
  shoppingCart,
}: Props) => {
  const { items, totalPrice } = shoppingCart;

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setShow}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {" "}
                          Shopping Cart{" "}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            onClick={() => setShow(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1">
                      {items.length === 0 ? (
                        <div className="px-4 sm:px-6">
                          <p>There's nothing in your shopping cart.</p>

                          <div className="mt-16 p-8">
                            <img
                              src="/empty_cart.svg"
                              alt="Empty Cart"
                              className="w-full max-w-full"
                            />
                          </div>

                          <button
                            onClick={() => setShow(false)}
                            className="mt-8 text-red-500 font-semibold underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-4 rounded"
                          >
                            Go back to shopping
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4 flow-root ">
                          <ul className="-my-6 divide-y divide-gray-200 px-4 sm:px-6">
                            {items.map((item) => (
                              <li
                                key={item.details.letter}
                                className="flex py-6"
                              >
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.details.previewURL}
                                    alt={"Preview Not Available"}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <div>
                                        {item.details.offer &&
                                        item.amount ===
                                          item.details.offer.amount ? (
                                          <span className="bg-red-500 text-xs text-white px-2 py-1 rounded mb-2 inline-block">
                                            LIMITED OFFER (
                                            {item.details.offer.amount} for{" "}
                                            {item.details.offer.price}€)
                                          </span>
                                        ) : null}

                                        <h3>
                                          <Link
                                            className="focus:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            to={`/items/${item.details.letter}`}
                                          >
                                            {item.details.name}
                                          </Link>
                                        </h3>
                                      </div>

                                      {item.details.offer &&
                                      item.amount ===
                                        item.details.offer.amount ? (
                                        <p className="ml-4 flex">
                                          {item.details.offer.price}{" "}
                                          <span className="ml-1">€</span>
                                        </p>
                                      ) : (
                                        <p className="ml-4 flex">
                                          {item.details.price * item.amount}{" "}
                                          <span className="ml-1">€</span>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex mt-2 flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Qty {item.amount}
                                    </p>

                                    <div className="flex">
                                      <form
                                        action="/shopping-cart/remove-item"
                                        method="POST"
                                      >
                                        <button
                                          type="submit"
                                          className="font-medium text-red-500 hover:text-red-400 rounded focus:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                          Remove
                                        </button>

                                        <input
                                          type="hidden"
                                          name="letter"
                                          value={item.details.letter}
                                        />
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className="border-t mt-8 border-gray-200 py-6 px-4 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <p>Subtotal</p>
                              <p>{totalPrice.toFixed(2)} €</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              Shipping and taxes calculated at checkout.
                            </p>
                            <div className="mt-6">
                              <button className="focus:outline-none focus:ring-2 w-full focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center rounded-md border border-transparent bg-red-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-400">
                                Checkout
                              </button>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                              <p>
                                or{" "}
                                <button
                                  type="button"
                                  className="font-medium text-red-500 hover:text-red-400 rounded focus:ring-offset-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                                  onClick={() => setShow(false)}
                                >
                                  Continue Shopping
                                  <span aria-hidden="true"> &rarr;</span>
                                </button>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
