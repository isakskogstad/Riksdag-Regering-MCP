import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Calendar, User, Download, ArrowLeft, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import ProgressTracker from "@/components/ProgressTracker";
import { FavoriteButton } from "@/components/FavoriteButton";
import { AdvancedFilters } from "@/components/AdvancedFilters";
import { useDocumentAnalytics } from "@/hooks/useDocumentAnalytics";
import { useDebounce } from "@/hooks/useDebounce";
import { exportToCSV, exportToJSON } from "@/lib/exportUtils";
import { format } from "date-fns";
import { PAGINATION, SEARCH } from "@/config/constants";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GenericDocumentPageProps {
  tableName: string;
  title: string;
  description: string;
  source: "riksdagen" | "regeringskansliet";
  backLink?: string;
  dataType?: string;
  dateColumn?: string;
  titleColumn?: string;
}

export const GenericDocumentPage = ({
  tableName,
  title,
  description,
  source,
  backLink = source === "riksdagen" ? "/riksdagen" : "/regeringskansliet",
  dataType,
  dateColumn = "publicerad_datum",
  titleColumn = "titel",
}: GenericDocumentPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("datum");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;
  const { trackView } = useDocumentAnalytics();

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH.DEBOUNCE_DELAY);

  const { data: documents, isLoading } = useQuery({
    queryKey: [tableName, debouncedSearchQuery, sortBy, dateFrom, dateTo, selectedCategories],
    queryFn: async () => {
      let query = supabase.from(tableName as any).select("*");

      if (debouncedSearchQuery && debouncedSearchQuery.length >= SEARCH.MIN_SEARCH_LENGTH) {
        query = query.or(`titel.ilike.%${debouncedSearchQuery}%,document_id.ilike.%${debouncedSearchQuery}%,beteckningsnummer.ilike.%${debouncedSearchQuery}%`);
      }

      if (dateFrom) {
        query = query.gte(dateColumn, dateFrom);
      }

      if (dateTo) {
        query = query.lte(dateColumn, dateTo);
      }

      const sortColumn = sortBy === "datum" ? dateColumn : titleColumn;
      query = query.order(sortColumn, { ascending: sortBy === "datum" ? false : true, nullsFirst: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Extract unique categories from documents
  const availableCategories = useMemo(() => {
    if (!documents) return [];
    const categories = new Set<string>();
    documents.forEach((doc: any) => {
      if (doc.kategorier && Array.isArray(doc.kategorier)) {
        doc.kategorier.forEach((cat: string) => categories.add(cat));
      }
    });
    return Array.from(categories).sort();
  }, [documents]);

  // Filter documents by category
  const filteredDocuments = useMemo(() => {
    if (!documents) return [];
    if (selectedCategories.length === 0) return documents;
    
    return documents.filter((doc: any) => {
      if (!doc.kategorier || !Array.isArray(doc.kategorier)) return false;
      return selectedCategories.some((cat) => doc.kategorier.includes(cat));
    });
  }, [documents, selectedCategories]);

  // Pagination
  const totalPages = Math.ceil((filteredDocuments?.length || 0) / itemsPerPage);
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDocuments?.slice(start, start + itemsPerPage) || [];
  }, [filteredDocuments, currentPage]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (!filteredDocuments || filteredDocuments.length === 0) return;
    const exportData = filteredDocuments.map((doc: any) => ({
      titel: doc.titel,
      document_id: doc.document_id,
      beteckningsnummer: doc.beteckningsnummer,
      publicerad_datum: doc.publicerad_datum,
      avsandare: doc.avsandare || doc.departement,
      kategorier: doc.kategorier?.join("; "),
    }));
    exportToCSV(exportData, `${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}`);
  };

  const handleExportJSON = () => {
    if (!filteredDocuments || filteredDocuments.length === 0) return;
    exportToJSON(filteredDocuments, `${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}`);
  };

  const renderLocalFiles = (localFiles: any) => {
    if (!localFiles) return null;

    const files = Array.isArray(localFiles) ? localFiles : [localFiles];
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {files.map((file: any, idx: number) => {
          const fileName = file.name || file.filename || `Fil ${idx + 1}`;
          const fileUrl = file.url || file.local_url || file;
          
          if (typeof fileUrl === 'string' && fileUrl) {
            return (
              <a
                key={idx}
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Download className="h-3 w-3" />
                {fileName}
              </a>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="mb-8">
          <Link to={backLink}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg mb-6">{description}</p>

          <ProgressTracker source={source} />

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center mb-6">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Sök efter titel, dokumentnummer eller beteckning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 h-11 border rounded-md bg-background text-sm min-w-[200px]"
            >
              <option value="datum">Sortera efter datum</option>
              <option value="titel">Sortera efter titel</option>
            </select>
            <AdvancedFilters
              dateFrom={dateFrom}
              dateTo={dateTo}
              selectedCategories={selectedCategories}
              availableCategories={availableCategories}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onCategoryToggle={handleCategoryToggle}
              onClearFilters={handleClearFilters}
            />
            <Button variant="outline" onClick={handleExportCSV} disabled={!filteredDocuments || filteredDocuments.length === 0} className="h-11">
              <FileDown className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exportera CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <Button variant="outline" onClick={handleExportJSON} disabled={!filteredDocuments || filteredDocuments.length === 0} className="h-11">
              <FileDown className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exportera JSON</span>
              <span className="sm:hidden">JSON</span>
            </Button>
          </div>

          {(dateFrom || dateTo || selectedCategories.length > 0) && (
            <div className="mb-4 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Visar {filteredDocuments?.length || 0} av {documents?.length || 0} dokument
              </p>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : !paginatedDocuments || paginatedDocuments.length === 0 ? (
          <EmptyState
            message={`Inga ${title.toLowerCase()} hittades`}
            suggestion={searchQuery || dateFrom || dateTo || selectedCategories.length > 0 ? "Prova att ändra dina filter" : `Använd knappen ovan för att hämta ${title.toLowerCase()}`}
          />
        ) : (
          <>
            <div className="space-y-4">
              {paginatedDocuments.map((doc: any) => (
                <Card key={doc.id} className="hover:shadow-sm transition-all duration-200 border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {doc.titel || doc.document_id}
                        </CardTitle>
                      <CardDescription className="space-y-1">
                        {doc.beteckningsnummer && (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{doc.beteckningsnummer}</span>
                          </div>
                        )}
                        {doc.publicerad_datum && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(doc.publicerad_datum), "d MMMM yyyy")}
                            </span>
                          </div>
                        )}
                        {(doc.avsandare || doc.departement) && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{doc.avsandare || doc.departement}</span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-start gap-2">
                      {doc.kategorier && doc.kategorier.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {doc.kategorier.slice(0, 3).map((kat: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {kat}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <FavoriteButton tableName={tableName} documentId={doc.document_id} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {doc.innehall && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                      {doc.innehall}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {doc.url && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => trackView({ tableName, documentId: doc.document_id })}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Visa original
                        </Button>
                      </a>
                    )}
                    {doc.local_pdf_url && (
                      <a href={doc.local_pdf_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Ladda ner PDF
                        </Button>
                      </a>
                    )}
                    {doc.markdown_url && (
                      <a href={doc.markdown_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Markdown
                        </Button>
                      </a>
                    )}
                  </div>
                  {(doc.local_files || doc.local_bilagor) && renderLocalFiles(doc.local_files || doc.local_bilagor)}
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                      return false;
                    })
                    .map((page, idx, arr) => {
                      if (idx > 0 && page - arr[idx - 1] > 1) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <span className="px-4">...</span>
                          </PaginationItem>
                        );
                      }
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
};