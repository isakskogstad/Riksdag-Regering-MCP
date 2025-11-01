import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientInformationsmaterial = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_informationsmaterial"
      title="Informationsmaterial"
      description="Informationsmaterial från regeringskansliet"
      source="regeringskansliet"
      dataType="informationsmaterial"
    />
  );
};

export default RegeringskanslientInformationsmaterial;