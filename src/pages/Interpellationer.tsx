import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const Interpellationer = () => {
  return (
    <GenericDocumentPage
      tableName="riksdagen_interpellationer"
      title="Interpellationer"
      description="Interpellationer från ledamöterna till regeringen"
      source="riksdagen"
      dateColumn="publicerad_datum"
      titleColumn="titel"
    />
  );
};

export default Interpellationer;
