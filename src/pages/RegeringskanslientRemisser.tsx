import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientRemisser = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_remisser"
      title="Remisser"
      description="Remissvar och remissförfaranden"
      source="regeringskansliet"
      dataType="remisser"
    />
  );
};

export default RegeringskanslientRemisser;