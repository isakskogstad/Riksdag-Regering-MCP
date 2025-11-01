import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const RegeringskanslientOverenskommelserAvtal = () => {
  return (
    <GenericDocumentPage
      tableName="regeringskansliet_overenskommelser_avtal"
      title="Överenskommelser och avtal"
      description="Överenskommelser och avtal med organisationer och myndigheter"
      source="regeringskansliet"
      dataType="overenskommelser_avtal"
    />
  );
};

export default RegeringskanslientOverenskommelserAvtal;