import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientRapporter = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_rapporter"
      title="Rapporter"
      description="Rapporter från regeringskansliet"
      source="regeringskansliet"
      dataType="rapporter"
    />
  );
};

export default RegeringskanslientRapporter;