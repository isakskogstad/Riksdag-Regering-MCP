import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientSkrivelse = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_skrivelse"
      title="Skrivelser"
      description="Regeringens skrivelser till riksdagen"
      source="regeringskansliet"
      dataType="skrivelse"
    />
  );
};

export default RegeringskanslientSkrivelse;