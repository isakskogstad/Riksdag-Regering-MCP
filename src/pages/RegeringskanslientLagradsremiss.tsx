import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientLagradsremiss = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_lagradsremiss"
      title="Lagradsremisser"
      description="Remisser till Lagrådet"
      source="regeringskansliet"
      dataType="lagradsremiss"
    />
  );
};

export default RegeringskanslientLagradsremiss;