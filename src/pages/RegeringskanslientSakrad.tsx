import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientSakrad = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_sakrad"
      title="Sakråd"
      description="Sakråd och expertråd"
      source="regeringskansliet"
      dataType="sakrad"
    />
  );
};

export default RegeringskanslientSakrad;