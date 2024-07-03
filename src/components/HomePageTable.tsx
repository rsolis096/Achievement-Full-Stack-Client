import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Image,
  Pagination,
  Selection,
} from "@nextui-org/react";
import { RankedGame } from "../interfaces/types";

interface HomePageTableProps {
  rows: RankedGame[];
  title: string;
}

const columns = [
  {
    key: "rank",
    label: "Rank",
  },
  {
    key: "appid",
    label: "",
  },
  {
    key: "name",
    label: "Title",
  },
];

const imageURL: string = "https://cdn.akamai.steamstatic.com/steam/apps/";
const imageURLEnd: string = "/header.jpg";

//Get the id numbers for each image (better suited for item)
const getImageURL = (id: number) => {
  return ((imageURL + id) as string) + imageURLEnd;
};

function HomePageTable(props: HomePageTableProps) {
  const [page, setPage] = useState<number>(1); // Initialize the page state to 1
  const navigate = useNavigate();

  const handleCardPressed = (selected: Selection) => {
    const selectedValue: number = Array.from(selected)[0] as number;
    const appid = props.rows[selectedValue - 1].appid;
    navigate("/view/" + appid);
  };

  //Assigns content to rows based on column key
  const renderCell = useCallback((item: RankedGame, columnKey: string) => {
    switch (columnKey) {
      case "appid":
        return <Image width={100} src={getImageURL(item.appid)} />;
      case "name":
        return (
          <p className=" text-ellipsis whitespace-nowrap overflow-hidden">
            {item.name}
          </p>
        );
      case "rank":
        return <p>{item.rank}</p>;
    }
  }, []);

  const rowsPerPage = 10;

  const pages = Math.ceil(props.rows.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return props.rows.slice(start, end);
  }, [page, props.rows]);

  return (
    <Table
      aria-label="Example table with dynamic content"
      isCompact
      layout="fixed"
      onSelectionChange={handleCardPressed}
      bottomContentPlacement="inside"
      selectionMode="single"
      selectionBehavior="replace"
      classNames={{
        wrapper: "text-white border border-white/20",
      }}
      topContent={<p>{props.title}</p>}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            classNames={{
              wrapper: "gap-1",
              item: "bg-transparent",
              cursor:
                "bg-gradient-to-b from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold",
            }}
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            width={column.key === "rank" ? 50 : column.key == "appid" ? 150 : 0}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={<p>Loading...</p>} items={items}>
        {(item) => (
          <TableRow className="cursor-pointer " key={item.rank}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default HomePageTable;
