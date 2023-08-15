import { Button, Table, Pagination } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

interface InTableProps {
  api?: Function;
  columns?: ColumnsType<AnyObject> ;
  data?: [];
}

export default function InTable(props: InTableProps) {
  const {
    api = null,
    columns = [],
    data = [],
  } = props;
  const [list, setList] = useState(data);

  useEffect(() => {
    if (api) {
      api().then((res: any) => {
        setList(res);
      });
    }
  }, [])

  return (
    <>
      <Table 
        columns={columns}
        dataSource={list}
        pagination={false}
      />
    </>
  )
}
