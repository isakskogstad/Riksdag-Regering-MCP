import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientSOU = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_sou"
      title="Statens Offentliga Utredningar (SOU)"
      description="SOU innehåller betänkanden från statliga utredningar"
      source="regeringskansliet"
      dataType="sou"
    />
  );
};

export default RegeringskanslientSOU;