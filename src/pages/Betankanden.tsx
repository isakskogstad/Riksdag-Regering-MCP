import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const Betankanden = () => {
  return (
    <GenericDocumentPage
      tableName="riksdagen_betankanden"
      title="Betänkanden"
      description="Utskottens betänkanden och utlåtanden samt riksdagens beslut"
      source="riksdagen"
      dateColumn="publicerad_datum"
      titleColumn="titel"
    />
  );
};

export default Betankanden;
