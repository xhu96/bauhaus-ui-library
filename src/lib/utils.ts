import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const mergeBauhausClasses = extendTailwindMerge({ prefix: 'bui-' })

/** Merge Tailwind class names, resolving conflicts (last wins). */
export function cn(...inputs: ClassValue[]) {
  return mergeBauhausClasses(clsx(inputs))
}
