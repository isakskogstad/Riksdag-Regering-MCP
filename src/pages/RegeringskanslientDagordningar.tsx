import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientDagordningar = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_dagordningar"
      title="Dagordningar"
      description="Dagordningar för regeringssammanträden"
      source="regeringskansliet"
      dataType="dagordningar"
    />
  );
};

export default RegeringskanslientDagordningar;