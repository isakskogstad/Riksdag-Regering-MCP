import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientArendeforteckningar = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_arendeforteckningar"
      title="Ärendeförteckningar"
      description="Förteckningar över ärenden"
      source="regeringskansliet"
      dataType="arendeforteckningar"
    />
  );
};

export default RegeringskanslientArendeforteckningar;