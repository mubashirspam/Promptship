'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/use-categories';

/** Radix Select has no "empty value" slot, so All gets a reserved sentinel. */
const ALL = '__all__';

interface CategorySelectProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

/**
 * Category picker as a dropdown — replaces the horizontally-scrolling chip row,
 * which did not survive a catalog with dozens of categories. Subcategories are
 * grouped under their parent rather than living in a second chip row.
 */
export function CategorySelect({
  activeCategory,
  onCategoryChange,
  className,
}: CategorySelectProps) {
  const categories = useCategories();
  const topLevel = categories.filter((c) => !c.parentId);

  return (
    <Select
      value={activeCategory ?? ALL}
      onValueChange={(value) =>
        onCategoryChange(value === ALL ? null : value)
      }
    >
      <SelectTrigger className={className} size="sm">
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent className="max-h-[380px]">
        <SelectItem value={ALL}>All categories</SelectItem>
        {topLevel.map((parent) => {
          const children = categories.filter(
            (c) => c.parentId && c.parentId === parent.id
          );

          if (children.length === 0) {
            return (
              <SelectItem key={parent.slug} value={parent.slug}>
                {parent.label}
              </SelectItem>
            );
          }

          return (
            <SelectGroup key={parent.slug}>
              <SelectLabel>{parent.label}</SelectLabel>
              <SelectItem value={parent.slug}>
                All {parent.label}
              </SelectItem>
              {children.map((child) => (
                <SelectItem key={child.slug} value={child.slug}>
                  {child.label}
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
}
