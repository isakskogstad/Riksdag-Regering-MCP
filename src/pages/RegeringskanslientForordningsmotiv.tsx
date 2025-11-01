import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientForordningsmotiv = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_forordningsmotiv"
      title="Förordningsmotiv"
      description="Motiv till förordningar"
      source="regeringskansliet"
      dataType="forordningsmotiv"
    />
  );
};

export default RegeringskanslientForordningsmotiv;