import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const Protokoll = () => {
  return (
    <GenericDocumentPage
      tableName="riksdagen_protokoll"
      title="Protokoll"
      description="Protokoll från kammarens sammanträden"
      source="riksdagen"
      dateColumn="publicerad_datum"
      titleColumn="titel"
    />
  );
};

export default Protokoll;
