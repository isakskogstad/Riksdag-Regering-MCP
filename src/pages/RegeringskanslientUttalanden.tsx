import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientUttalanden = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_uttalanden"
      title="Uttalanden"
      description="Uttalanden från regeringen"
      source="regeringskansliet"
      dataType="uttalanden"
    />
  );
};

export default RegeringskanslientUttalanden;