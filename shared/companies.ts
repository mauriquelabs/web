/**
 * Shared types for the admin Music Tech Index companies view.
 * Mirrors the `companies` / `categories` / `investors` tables in Supabase.
 */

export interface CompanySummary {
  id: number;
  name: string;
  logoUrl: string | null;
  totalInvestmentMusd: number;
  description: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  country: string | null;
  categories: string[];
  investors: string[];
}

export interface ListCompaniesResponse {
  companies: CompanySummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CategoryOption {
  id: number;
  name: string;
}

export interface ListCategoriesResponse {
  categories: CategoryOption[];
}
