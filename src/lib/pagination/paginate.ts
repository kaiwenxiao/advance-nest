import {IPaginationOptions} from "@lib/pagination/pagination-option.interface";
import {Pagination} from "@lib/pagination/pagination";
import {createPaginationObject} from "@lib/pagination/create-pagination";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function paginate<T>(
  items: T[],
  options: IPaginationOptions
): Promise<Pagination<T>> {
  const [page, limit, route] = resolveOptions(options)

  if(page < 1) {
    return createPaginationObject([], 0, page, limit, route)
  }

  return createPaginationObject<T>(items, items.length, page, limit, route)
}

function resolveOptions(options: IPaginationOptions): [number, number, string] {
  const page = resolveNumericOption(options, 'page', DEFAULT_PAGE)
  const limit = resolveNumericOption(options, 'limit', DEFAULT_LIMIT)
  const router = options.route

  return [page, limit, router!]
}

function resolveNumericOption(
  options: IPaginationOptions,
  key: 'page' | 'limit',
  defaultValue: number
): number {
  const value = options[key]
  const resolvedValue = Number(value)

  if(Number.isInteger(resolvedValue) && resolvedValue >= 0) {
    return resolvedValue
  }

  console.warn(
    `Query parameter "${key}" with value "${value}" was resolved as "${resolvedValue}", please validate your query input! Falling back to default "${defaultValue}"`
  )

  return defaultValue
}