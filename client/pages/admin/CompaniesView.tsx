import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ExternalLink, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { fetchCategories, fetchCompanies } from "@/lib/adminApi";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CompanySummary } from "@shared/companies";

const PAGE_SIZE = 20;
const ALL_CATEGORIES_VALUE = "all";

function formatInvestment(musd: number): string {
  if (!musd || musd <= 0) return "—";
  return `$${musd.toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
}

function TagList({ items, limit = 3 }: { items: string[]; limit?: number }) {
  if (items.length === 0) {
    return <span className="text-foreground/40">—</span>;
  }

  const visible = items.slice(0, limit);
  const remaining = items.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((item) => (
        <Badge key={item} variant="secondary" className="font-normal">
          {item}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline" className="font-normal">
          +{remaining}
        </Badge>
      )}
    </div>
  );
}

export default function CompaniesView() {
  const { session } = useAuth();
  const accessToken = session?.access_token;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<CompanySummary | null>(
    null,
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(handle);
  }, [searchInput]);

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: ({ signal }) => fetchCategories(accessToken as string, signal),
    enabled: Boolean(accessToken),
  });

  const companiesQuery = useQuery({
    queryKey: ["admin-companies", { search, categoryId, page }],
    queryFn: ({ signal }) =>
      fetchCompanies(
        { search, categoryId, page, pageSize: PAGE_SIZE },
        accessToken as string,
        signal,
      ),
    enabled: Boolean(accessToken),
    placeholderData: keepPreviousData,
  });

  const companies = companiesQuery.data?.companies ?? [];
  const total = companiesQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleCategoryChange = (value: string) => {
    setCategoryId(value === ALL_CATEGORIES_VALUE ? undefined : Number(value));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl">Music Tech Index</h2>
          <p className="text-sm text-foreground/60">
            {total} {total === 1 ? "company" : "companies"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
              aria-hidden
            />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search companies…"
              aria-label="Search companies"
              className="pl-9 sm:w-64"
            />
          </div>

          <Select
            value={categoryId ? String(categoryId) : ALL_CATEGORIES_VALUE}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="sm:w-56" aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES_VALUE}>
                All categories
              </SelectItem>
              {categoriesQuery.data?.categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Investment</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Investors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companiesQuery.isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!companiesQuery.isLoading && companiesQuery.isError && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-destructive"
                >
                  Could not load companies. Please try again.
                </TableCell>
              </TableRow>
            )}

            {!companiesQuery.isLoading &&
              !companiesQuery.isError &&
              companies.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-foreground/60"
                  >
                    No companies found.
                  </TableCell>
                </TableRow>
              )}

            {!companiesQuery.isLoading &&
              companies.map((company) => (
                <TableRow
                  key={company.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedCompany(company)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedCompany(company);
                    }
                  }}
                >
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.country ?? "—"}</TableCell>
                  <TableCell>
                    {formatInvestment(company.totalInvestmentMusd)}
                  </TableCell>
                  <TableCell>
                    <TagList items={company.categories} />
                  </TableCell>
                  <TableCell>
                    <TagList items={company.investors} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page === 1}
                onClick={(event) => {
                  event.preventDefault();
                  setPage((current) => Math.max(1, current - 1));
                }}
                className={
                  page === 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm text-foreground/70">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page === totalPages}
                onClick={(event) => {
                  event.preventDefault();
                  setPage((current) => Math.min(totalPages, current + 1));
                }}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog
        open={Boolean(selectedCompany)}
        onOpenChange={(open) => !open && setSelectedCompany(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCompany.name}</DialogTitle>
                {selectedCompany.country && (
                  <DialogDescription>
                    {selectedCompany.country}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-4 text-sm">
                {selectedCompany.description && (
                  <p className="text-foreground/80">
                    {selectedCompany.description}
                  </p>
                )}

                <div>
                  <p className="mb-1.5 font-medium text-foreground/60">
                    Total investment
                  </p>
                  <p>{formatInvestment(selectedCompany.totalInvestmentMusd)}</p>
                </div>

                <div>
                  <p className="mb-1.5 font-medium text-foreground/60">
                    Categories
                  </p>
                  <TagList
                    items={selectedCompany.categories}
                    limit={selectedCompany.categories.length}
                  />
                </div>

                <div>
                  <p className="mb-1.5 font-medium text-foreground/60">
                    Investors
                  </p>
                  <TagList
                    items={selectedCompany.investors}
                    limit={selectedCompany.investors.length}
                  />
                </div>

                {(selectedCompany.websiteUrl ||
                  selectedCompany.linkedinUrl) && (
                  <div className="flex flex-wrap gap-4 pt-2">
                    {selectedCompany.websiteUrl && (
                      <a
                        href={selectedCompany.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-accent2 hover:underline"
                      >
                        Website <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {selectedCompany.linkedinUrl && (
                      <a
                        href={selectedCompany.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-accent2 hover:underline"
                      >
                        LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
