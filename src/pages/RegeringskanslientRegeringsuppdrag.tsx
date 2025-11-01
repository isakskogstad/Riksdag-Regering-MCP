import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientRegeringsuppdrag = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_regeringsuppdrag"
      title="Regeringsuppdrag"
      description="Regeringens uppdrag till myndigheter och organisationer"
      source="regeringskansliet"
      dataType="regeringsuppdrag"
    />
  );
};

export default RegeringskanslientRegeringsuppdrag;