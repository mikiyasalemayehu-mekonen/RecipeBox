"use client";

import { Fragment, useState, useEffect } from "react";
import { Combobox as UICombobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Spinner } from "./Spinner";

export interface ComboboxItem {
  id: number | string;
  name: string;
}

export interface ComboboxProps {
  items: ComboboxItem[];
  selected: ComboboxItem[];
  onChange: (items: ComboboxItem[]) => void;
  onSearch?: (query: string) => void;
  onCreate?: (name: string) => void;
  loading?: boolean;
  placeholder?: string;
  label?: string;
}

export function Combobox({ items, selected, onChange, onSearch, onCreate, loading, placeholder = "Search...", label }: ComboboxProps) {
  const [query, setQuery] = useState("");

  // Debounce search
  useEffect(() => {
    if (!onSearch) return;
    const timeout = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  const filteredItems = query === ""
    ? items
    : items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  const handleCreate = () => {
    if (onCreate && query.trim() !== "") {
      onCreate(query.trim());
      setQuery("");
    }
  };

  return (
    <div className="w-full flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
      <UICombobox value={selected} onChange={onChange} multiple>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-xl border-2 border-border bg-transparent text-left focus-within:border-primary transition-colors sm:text-sm">
            <div className="pl-3 pr-10 py-2 flex flex-wrap gap-2 min-h-[44px] items-center">
              {selected.map((item) => (
                <span key={item.id} className="inline-flex items-center gap-1 rounded bg-accent/20 px-2 py-0.5 text-sm">
                  {item.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onChange(selected.filter((s) => s.id !== item.id));
                    }}
                    className="text-text-secondary hover:text-danger"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <UICombobox.Input
                className="flex-1 min-w-[120px] bg-transparent border-none py-1 pl-1 pr-2 text-sm leading-5 text-text-primary focus:ring-0 outline-none"
                displayValue={() => ""}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={selected.length === 0 ? placeholder : ""}
              />
            </div>
            <UICombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              {loading ? (
                <Spinner size="sm" className="h-4 w-4" />
              ) : (
                <ChevronUpDownIcon className="h-5 w-5 text-text-secondary" aria-hidden="true" />
              )}
            </UICombobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <UICombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-surface py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
              {filteredItems.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-text-primary flex justify-between items-center">
                  <span>Nothing found.</span>
                  {onCreate && (
                    <button
                      type="button"
                      onClick={handleCreate}
                      className="text-primary hover:underline font-medium"
                    >
                      Create "{query}"
                    </button>
                  )}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <UICombobox.Option
                    key={item.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-primary text-white" : "text-text-primary"
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                          {item.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-primary"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </UICombobox.Option>
                ))
              )}
            </UICombobox.Options>
          </Transition>
        </div>
      </UICombobox>
    </div>
  );
}
