import Link from "next/link";
import Image from "next/image";
import { ClockIcon, CurrencyDollarIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Recipe } from "@/types";
import { formatTime, formatPrice, hashColor } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface RecipeCardProps {
  recipe: Recipe & { image?: string | null };
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function RecipeCard({ recipe, onDelete, onEdit }: RecipeCardProps) {
  const visibleTags = recipe.tags.slice(0, 3);
  const hiddenTagsCount = recipe.tags.length - 3;

  return (
    <Card className="flex flex-col h-full group relative overflow-hidden">
      <Link href={`/recipes/${recipe.id}`} className="absolute inset-0 z-0" aria-label={`View ${recipe.title}`} />
      
      <div className="relative h-48 w-full bg-accent/20 overflow-hidden">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <span className="text-5xl font-extrabold text-primary/40 capitalize">{recipe.title.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 z-10">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="p-2 rounded-full bg-surface/80 backdrop-blur hover:bg-surface text-text-primary shadow-sm transition-colors focus:outline-none">
            <EllipsisVerticalIcon className="h-5 w-5" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right rounded-xl bg-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(recipe.id); }}
                      className={`${active ? 'bg-primary/10 text-primary' : 'text-text-primary'} group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}
                    >
                      Edit
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(recipe.id); }}
                      className={`${active ? 'bg-danger/10 text-danger' : 'text-text-primary'} group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}
                    >
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <CardHeader className="pb-3 z-10 pointer-events-none">
        <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
        <div className="flex flex-wrap gap-3 text-xs text-text-secondary font-medium uppercase tracking-wide mt-2">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{formatTime(recipe.time_minutes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>{formatPrice(recipe.price)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow z-10 pointer-events-none">
        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0 pb-4 flex flex-wrap gap-2 z-10 pointer-events-none">
        {visibleTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-text-primary"
            style={{ color: hashColor(tag.name) }}
          >
            {tag.name}
          </span>
        ))}
        {hiddenTagsCount > 0 && (
          <span className="inline-flex items-center rounded bg-border/50 px-2 py-0.5 text-xs font-semibold text-text-secondary">
            +{hiddenTagsCount} more
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
