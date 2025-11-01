import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientUDAvrader = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_ud_avrader"
      title="UD avråder"
      description="Utrikesdepartementets reseavråden"
      source="regeringskansliet"
      dataType="ud_avrader"
    />
  );
};

export default RegeringskanslientUDAvrader;