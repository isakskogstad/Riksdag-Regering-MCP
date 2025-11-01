import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientRegeringsarenden = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_regeringsarenden"
      title="Regeringsärenden"
      description="Ärenden som behandlas av regeringen"
      source="regeringskansliet"
      dataType="regeringsarenden"
    />
  );
};

export default RegeringskanslientRegeringsarenden;