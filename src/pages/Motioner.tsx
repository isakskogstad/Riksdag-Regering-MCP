import { GenericDocumentPage } from "@/components/GenericDocumentPage";

const Motioner = () => {
  return (
    <GenericDocumentPage
      tableName="riksdagen_motioner"
      title="Motioner"
      description="Motioner från riksdagens ledamöter - förslag till riksdagsbeslut"
      source="riksdagen"
      dateColumn="publicerad_datum"
      titleColumn="titel"
    />
  );
};

export default Motioner;
