import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientArtiklar = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_artiklar"
      title="Artiklar"
      description="Artiklar publicerade av regeringskansliet"
      source="regeringskansliet"
      dataType="artiklar"
    />
  );
};

export default RegeringskanslientArtiklar;