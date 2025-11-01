import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientDepartementsserien = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_departementsserien"
      title="Departementsserien (Ds)"
      description="Departementsserien innehåller utredningar och rapporter från departementen"
      source="regeringskansliet"
      dataType="departementsserien"
    />
  );
};

export default RegeringskanslientDepartementsserien;