import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientTal = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_tal"
      title="Tal"
      description="Tal av statsministern och ministrarna"
      source="regeringskansliet"
      dataType="tal"
    />
  );
};

export default RegeringskanslientTal;