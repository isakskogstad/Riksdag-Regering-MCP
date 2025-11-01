import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientDebattartiklar = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_debattartiklar"
      title="Debattartiklar"
      description="Debattartiklar från regeringen"
      source="regeringskansliet"
      dataType="debattartiklar"
    />
  );
};

export default RegeringskanslientDebattartiklar;