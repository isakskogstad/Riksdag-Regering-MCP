import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientBistandsstrategier = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_bistands_strategier"
      title="Biståndsstrategier"
      description="Strategier för internationellt utvecklingssamarbete"
      source="regeringskansliet"
      dataType="bistands_strategier"
    />
  );
};

export default RegeringskanslientBistandsstrategier;