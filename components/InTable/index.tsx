import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";

interface InTableProps {
  api?: string;
  columns?: ColumnsType ;
  data?: [];
}

export default function InTable(props: InTableProps) {
  const {
    api = null,
    columns = [],
    data = [],
  } = props;

  return (
    <>
      <Table 
        columns={columns}
      />
    </>
  )
}
