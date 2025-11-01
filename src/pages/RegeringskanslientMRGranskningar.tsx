import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientMRGranskningar = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_mr_granskningar"
      title="MR-granskningar"
      description="Mänskliga rättigheter - granskningar och rapporter"
      source="regeringskansliet"
      dataType="mr-granskningar"
    />
  );
};

export default RegeringskanslientMRGranskningar;