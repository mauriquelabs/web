import type { RequestHandler } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../../lib/supabase";
import type {
  CategoryOption,
  CompanySummary,
  ListCategoriesResponse,
  ListCompaniesResponse,
} from "@shared/companies";

interface CategoryRelation {
  categories: { id: number; name: string } | null;
}

interface InvestorRelation {
  investors: { id: number; name: string } | null;
}

interface CompanyRow {
  id: number;
  name: string;
  logo_url: string | null;
  total_investment_musd: number;
  description: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  country: string | null;
  company_categories: CategoryRelation[] | null;
  company_investors: InvestorRelation[] | null;
}

const listCompaniesQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

function mapCompanyRow(row: CompanyRow): CompanySummary {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    totalInvestmentMusd: row.total_investment_musd,
    description: row.description,
    websiteUrl: row.website_url,
    linkedinUrl: row.linkedin_url,
    country: row.country,
    categories: (row.company_categories ?? [])
      .map((relation) => relation.categories?.name)
      .filter((name): name is string => Boolean(name)),
    investors: (row.company_investors ?? [])
      .map((relation) => relation.investors?.name)
      .filter((name): name is string => Boolean(name)),
  };
}

export const handleListCompanies: RequestHandler = async (req, res) => {
  const parsed = listCompaniesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  const { search, categoryId, page, pageSize } = parsed.data;

  try {
    const supabase = getSupabaseAdmin();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // `!inner` turns the embedded relation filter below into a join filter on
    // the parent rows, instead of just filtering the nested array.
    const categoriesEmbed = categoryId
      ? "company_categories!inner(categories(id, name))"
      : "company_categories(categories(id, name))";

    let query = supabase
      .from("companies")
      .select(
        `id, name, logo_url, total_investment_musd, description, website_url, linkedin_url, country,
         ${categoriesEmbed},
         company_investors(investors(id, name))`,
        { count: "exact" },
      )
      .order("name")
      .range(from, to);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (categoryId) {
      query = query.eq("company_categories.category_id", categoryId);
    }

    const { data, error, count } = await query.returns<CompanyRow[]>();

    if (error) {
      console.error("Failed to list companies:", error);
      res.status(500).json({ error: "Failed to load companies" });
      return;
    }

    const response: ListCompaniesResponse = {
      companies: (data ?? []).map(mapCompanyRow),
      total: count ?? 0,
      page,
      pageSize,
    };

    res.json(response);
  } catch (error) {
    console.error("List companies error:", error);
    res.status(500).json({ error: "Failed to load companies" });
  }
};

export const handleListCategories: RequestHandler = async (_req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name")
      .returns<CategoryOption[]>();

    if (error) {
      console.error("Failed to list categories:", error);
      res.status(500).json({ error: "Failed to load categories" });
      return;
    }

    const response: ListCategoriesResponse = {
      categories: data ?? [],
    };

    res.json(response);
  } catch (error) {
    console.error("List categories error:", error);
    res.status(500).json({ error: "Failed to load categories" });
  }
};
