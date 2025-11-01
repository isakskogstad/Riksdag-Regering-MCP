import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientInternationellaOverenskommelser = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_internationella_overenskommelser"
      title="Internationella överenskommelser"
      description="Internationella överenskommelser och fördrag"
      source="regeringskansliet"
      dataType="internationella_overenskommelser"
    />
  );
};

export default RegeringskanslientInternationellaOverenskommelser;