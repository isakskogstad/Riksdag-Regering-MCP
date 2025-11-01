import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

// Map of path segments to readable names
const pathNames: Record<string, string> = {
  riksdagen: "Riksdagen",
  dokument: "Dokument",
  ledamoter: "Ledamöter",
  anforanden: "Anföranden",
  voteringar: "Voteringar",
  regeringskansliet: "Regeringskansliet",
  propositioner: "Propositioner",
  sou: "SOU",
  pressmeddelanden: "Pressmeddelanden",
  tal: "Tal",
  artiklar: "Artiklar",
  debattartiklar: "Debattartiklar",
  uttalanden: "Uttalanden",
  departementsserien: "Departementsserien (Ds)",
  skrivelse: "Skrivelser",
  forordningsmotiv: "Förordningsmotiv",
  kommittedirektiv: "Kommittédirektiv",
  lagradsremiss: "Lagradsremisser",
  remisser: "Remisser",
  regeringsarenden: "Regeringsärenden",
  regeringsuppdrag: "Regeringsuppdrag",
  sakrad: "Sakråd",
  "mr-granskningar": "MR-granskningar",
  "bistands-strategier": "Biståndsstrategier",
  "ud-avrader": "UD avråder",
  "internationella-overenskommelser": "Internationella överenskommelser",
  faktapromemoria: "Faktapromemorior",
  kategorier: "Kategorier",
  dagordningar: "Dagordningar",
  rapporter: "Rapporter",
  "overenskommelser-avtal": "Överenskommelser & avtal",
  arendeforteckningar: "Ärendeförteckningar",
  informationsmaterial: "Informationsmaterial",
  favorites: "Favoriter",
  admin: "Admin",
  login: "Logga in",
};

export const DynamicBreadcrumbs = () => {
  const location = useLocation();

  // Split path and filter out empty segments
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on homepage
  if (pathSegments.length === 0) {
    return null;
  }

  // Build breadcrumb paths
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const name = pathNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;

    return { path, name, isLast };
  });

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5" />
              <span>Hem</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic path segments */}
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={crumb.path}>
            <BreadcrumbSeparator />
            {crumb.isLast ? (
              <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={crumb.path}>{crumb.name}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
