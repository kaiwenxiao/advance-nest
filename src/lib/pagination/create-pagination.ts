import {Pagination} from "@lib/pagination/pagination";
import {IPaginationLinks, IPaginationMeta} from "@lib/pagination/pagination-option.interface";

export function createPaginationObject<T>(
  items: T[],
  totalItems: number,
  currentPage: number,
  limit: number,
  route?: string
): Pagination<T> {
  const totalPages = Math.ceil(totalItems / limit)

  const hasFirstPage = route
  const hasPreviousPage = route && currentPage > 1
  const hasNextPage = route && currentPage < totalPages
  const hasLastPage = route && totalPages > 0

  const symbol = route && new RegExp(/\?/) ? '&' : '?'

  const routes: IPaginationLinks = {
    first: hasFirstPage ? `${route}${symbol}limit=${limit}` : undefined,
    previous: hasPreviousPage ? `${route}${symbol}page=${currentPage - 1}&limit=${limit}` : undefined,
    next: hasNextPage ? `${route}${symbol}page=${currentPage + 1}&limit=${limit}` : undefined,
    last: hasLastPage ? `${route}${symbol}page=${totalPages}&limit=${limit}`: undefined
  }

  const meta: IPaginationMeta = {
    totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages,
    currentPage
  }

  return new Pagination(items, meta, (route?.length && route.length > 0) ? routes : undefined)
}