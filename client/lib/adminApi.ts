import type {
  ListCategoriesResponse,
  ListCompaniesResponse,
} from "@shared/companies";

export interface FetchCompaniesParams {
  search?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

async function parseErrorMessage(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  return body?.error ?? "Request failed";
}

export async function fetchCompanies(
  params: FetchCompaniesParams,
  accessToken: string,
  signal?: AbortSignal,
): Promise<ListCompaniesResponse> {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }
  if (params.categoryId) {
    searchParams.set("categoryId", String(params.categoryId));
  }
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("pageSize", String(params.pageSize ?? 20));

  const response = await fetch(`/api/admin/companies?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as ListCompaniesResponse;
}

export async function fetchCategories(
  accessToken: string,
  signal?: AbortSignal,
): Promise<ListCategoriesResponse> {
  const response = await fetch("/api/admin/categories", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as ListCategoriesResponse;
}
