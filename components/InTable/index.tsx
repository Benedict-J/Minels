import { Button, Table } from "antd";

interface InTableProps {
  api?: string;
  columns?: {};
  data?: [];
}

export default function InTable(props: InTableProps) {
  const {
    api = null,
    columns = {},
    data = [],
  } = props;

  return (
    <>
      <Table 
        
      />
    </>
  )
}