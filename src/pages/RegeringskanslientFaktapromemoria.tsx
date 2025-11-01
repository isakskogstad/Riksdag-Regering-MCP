import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientFaktapromemoria = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_faktapromemoria"
      title="Faktapromemorior"
      description="Faktapromemorior om EU-ärenden"
      source="regeringskansliet"
      dataType="faktapromemoria"
    />
  );
};

export default RegeringskanslientFaktapromemoria;