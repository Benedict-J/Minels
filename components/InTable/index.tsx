import { Button, Table, Pagination } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType } from "antd/es/table";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import styles from "./styles.module.scss";

interface InTableProps {
  api?: Function;
  columns?: ColumnsType<AnyObject> ;
  data?: [];
}

export default forwardRef(function InTable(props: InTableProps, ref) {
  const [loading, setLoading] = useState(false);
  const {
    api = null,
    columns = [],
    data = [],
  } = props;
  const [list, setList] = useState(data);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [nextPage, setNextPage] = useState(null);
  const [filter, setFilter] = useState({
    search: "",
  });

  const reload = async (isNext?: boolean) => {
    setLoading(true);
    if (api) {
      const res = await api(filter.search, size, isNext? nextPage : null);
      setList(res.data);
      setNextPage(res.next);
      setCount(res.count);
    }
    setLoading(false);
  }

  const handlePageChange = (pageNo: number, pageSize: number) => {
    setPage(pageNo);
    setSize(pageSize);

    if (pageNo - page < 0) {
      reload(false);
    } else {
      reload(true);
    }
  }

  useEffect(() => {
    setNextPage(null);
    reload();
  }, [filter])

  useImperativeHandle(ref, () => ({
    reload,
    setFilter
  }))

  return (
    <>
      <Table 
        columns={columns}
        dataSource={list}
        pagination={false}
        loading={loading}
        size="small"
      />
      <Pagination 
        className={styles.pagination} 
        size="small" 
        total={count} 
        current={page} 
        onChange={handlePageChange}
      />
    </>
  )
});

export type DataTableRef = {
  reload: () => void;
  setFilter: (val: any) => any;
}
