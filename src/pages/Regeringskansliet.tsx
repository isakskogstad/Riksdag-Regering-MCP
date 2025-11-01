import { Link } from "react-router-dom";
import { FileText, Newspaper, Scale, Database, Book, MessageSquare, Globe, Folder } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataFetchButton from "@/components/DataFetchButton";
import ProgressTracker from "@/components/ProgressTracker";
import FileQueueManager from "@/components/FileQueueManager";

const Regeringskansliet = () => {
  const documentCategories = [
    {
      title: "Rättsliga dokument",
      icon: Scale,
      variant: "warning" as const,
      items: [
        { title: "Propositioner", href: "/regeringskansliet/propositioner", description: "Lagförslag från regeringen" },
        { title: "Departementsserien (Ds)", href: "/regeringskansliet/departementsserien", description: "Utredningar från departementen" },
        { title: "SOU", href: "/regeringskansliet/sou", description: "Statens offentliga utredningar" },
        { title: "Skrivelser", href: "/regeringskansliet/skrivelse", description: "Regeringens skrivelser" },
        { title: "Förordningsmotiv", href: "/regeringskansliet/forordningsmotiv", description: "Motiv till förordningar" },
        { title: "Kommittédirektiv", href: "/regeringskansliet/kommittedirektiv", description: "Direktiv till utredningar" },
        { title: "Lagradsremisser", href: "/regeringskansliet/lagradsremiss", description: "Remisser till Lagrådet" },
        { title: "Remisser", href: "/regeringskansliet/remisser", description: "Remissförfaranden" },
        { title: "Regeringsärenden", href: "/regeringskansliet/regeringsarenden", description: "Ärenden behandlade av regeringen" },
        { title: "Regeringsuppdrag", href: "/regeringskansliet/regeringsuppdrag", description: "Uppdrag till myndigheter" },
        { title: "Sakråd", href: "/regeringskansliet/sakrad", description: "Sakråd och expertråd" },
      ]
    },
    {
      title: "Kommunikation",
      icon: Newspaper,
      variant: "info" as const,
      items: [
        { title: "Pressmeddelanden", href: "/regeringskansliet/pressmeddelanden", description: "Pressmeddelanden från regeringen" },
        { title: "Artiklar", href: "/regeringskansliet/artiklar", description: "Artiklar från regeringskansliet" },
        { title: "Debattartiklar", href: "/regeringskansliet/debattartiklar", description: "Debattartiklar från regeringen" },
        { title: "Tal", href: "/regeringskansliet/tal", description: "Tal av statsministern och ministrarna" },
        { title: "Uttalanden", href: "/regeringskansliet/uttalanden", description: "Uttalanden från regeringen" },
      ]
    },
    {
      title: "Internationellt",
      icon: Globe,
      variant: "success" as const,
      items: [
        { title: "MR-granskningar", href: "/regeringskansliet/mr-granskningar", description: "Mänskliga rättigheter - granskningar" },
        { title: "Biståndsstrategier", href: "/regeringskansliet/bistands-strategier", description: "Strategier för utvecklingssamarbete" },
        { title: "UD avråder", href: "/regeringskansliet/ud-avrader", description: "Utrikesdepartementets reseavråden" },
        { title: "Internationella överenskommelser", href: "/regeringskansliet/internationella-overenskommelser", description: "Internationella fördrag och avtal" },
        { title: "Faktapromemorior", href: "/regeringskansliet/faktapromemoria", description: "Faktapromemorior om EU-ärenden" },
      ]
    },
    {
      title: "Övrigt",
      icon: Folder,
      variant: "error" as const,
      items: [
        { title: "Dokument", href: "/regeringskansliet/dokument", description: "Alla dokument från regeringen.se" },
        { title: "Kategorier", href: "/regeringskansliet/kategorier", description: "Dokumentkategorier" },
        { title: "Dagordningar", href: "/regeringskansliet/dagordningar", description: "Dagordningar för regeringssammanträden" },
        { title: "Rapporter", href: "/regeringskansliet/rapporter", description: "Rapporter från regeringskansliet" },
        { title: "Överenskommelser & avtal", href: "/regeringskansliet/overenskommelser-avtal", description: "Överenskommelser med organisationer" },
        { title: "Ärendeförteckningar", href: "/regeringskansliet/arendeforteckningar", description: "Förteckningar över ärenden" },
        { title: "Informationsmaterial", href: "/regeringskansliet/informationsmaterial", description: "Informationsmaterial" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-primary py-1" />
      
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        <header className="text-center mb-16">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1" />
            <div className="flex-1 flex justify-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                  Regeringskansliet
                </h1>
                <div className="w-20 h-1 bg-secondary mx-auto mb-6"></div>
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <DataFetchButton type="regeringskansliet" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Utforska data från regeringen.se via g0v.se öppna data
          </p>
        </header>

        <ProgressTracker source="regeringskansliet" />
        <FileQueueManager />

        {/* Document Categories */}
        <div className="space-y-12">
          {documentCategories.map((category) => (
            <div key={category.title}>
              <div className="flex items-center gap-3 mb-6">
                <category.icon className={`h-6 w-6 ${category.variant === 'info' ? 'text-info' : category.variant === 'success' ? 'text-success' : category.variant === 'warning' ? 'text-warning' : 'text-error'}`} />
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/" 
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            ← Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Regeringskansliet;