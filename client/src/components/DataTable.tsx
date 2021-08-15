import * as React from 'react';
import {DataGrid} from '@material-ui/data-grid';
import {useListEntriesQuery} from "../generated-api";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const DataTable = () => {
  const classes = useStyles();
  const [sizeGt, setSizeGt] = React.useState(200);
  const [page, setPage] = React.useState(1);
  const [currentPath, setCurrentPath] = React.useState('/')
  const [history, updateHistory] = React.useState<{ id: string, path: string }[]>(
  [{
    id: '/',
    path: '/',
  }]
)

  const columns = [
    {field: 'path', headerName: 'Path', width: 90},
    {
      field: 'name',
      headerName: 'Filename',
      width: 150,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'size',
      headerName: 'Size',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      /*valueGetter: (params) =>
        `${params.getValue(params.id, 'firstName') || ''} ${
          params.getValue(params.id, 'lastName') || ''
        }`,*/
    },
  ];

  const {data, loading, error} = useListEntriesQuery({
    variables: {
      path: currentPath,
      page,
      where: {
        /**
         * File Size
         * @name size_gt a number value that file size should be greater than
         * @name size_lt a number value that file size should be less than
         */
        // size_gt: sizeGt, // Int
        // size_lt: Int,

        /**
         * Entry Name Contains
         * @name name_contains an entry "name" text value to search on
         */
        // name_contains: String,

        /**
         * Type Equals
         * @name type_eq Exact match for Entry type
         */
        // type_eq: "Directory" | "File",
      }
    },
  });

  React.useEffect(() => {
    setCurrentPath(history[history.length - 1].path)
  }, [history])

  const rows = React.useMemo(() => {
    const dataRows = data?.listEntries?.entries ?? [] as any

    return [
      ...(history.length > 1
        ? [
          {
            id: history[history.length - 2].id,
            path: history[history.length - 2].path,
            name: 'UP_DIR',
            __typename: 'UP_DIR'
          }
        ]
        : []),
      ...dataRows,
    ]
  }, [history.length, data?.listEntries?.entries])


  const rowCount = React.useMemo(() => {
    const totalUpDirRows = currentPath === '/'
      ? 0
      : (data?.listEntries?.pagination.pageCount ?? 0) * 1
    const totalRowsFromServer = data?.listEntries?.pagination.totalRows ?? 0
    return totalRowsFromServer + totalUpDirRows
  }, [
    data?.listEntries?.pagination.pageCount,
    data?.listEntries?.pagination.totalRows
  ])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleDelete = () => {
    setSizeGt(0)
  }

  return (
    <div style={{height: 400, width: '100%'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}

export default DataTable
