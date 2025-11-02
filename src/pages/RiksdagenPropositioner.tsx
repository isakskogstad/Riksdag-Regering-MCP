import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RiksdagenPropositioner = () => {
  return (
    <GenericDocumentPage
      tableName="riksdagen_propositioner"
      title="Propositioner"
      description="Propositioner och skrivelser från regeringen"
      source="riksdagen"
      dateColumn="publicerad_datum"
      titleColumn="titel"
    />
  );
};

export default RiksdagenPropositioner;
