import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientKommittedirektiv = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_kommittedirektiv"
      title="Kommittédirektiv"
      description="Direktiv till kommittéer och utredningar"
      source="regeringskansliet"
      dataType="kommittedirektiv"
    />
  );
};

export default RegeringskanslientKommittedirektiv;