import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const Fragor = () => {
  return (
    <GenericDocumentPage
      tableName="riksdagen_fragor"
      title="Skriftliga frågor"
      description="Skriftliga frågor från ledamöterna till regeringen"
      source="riksdagen"
      dateColumn="publicerad_datum"
      titleColumn="titel"
    />
  );
};

export default Fragor;
