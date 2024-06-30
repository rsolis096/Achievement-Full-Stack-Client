//Utility
import { useState } from "react";

//Styles
import {
  Tabs,
  Tab,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
} from "@nextui-org/react";
import LockIcon from "@mui/icons-material/Lock";
import SortIcon from "@mui/icons-material/Sort";
import LockOpenIcon from "@mui/icons-material/LockOpen";
//Mounted by App.tsx
interface FilterBarProps {
  setSortFilterP: (type: string) => void;
  setVisibleFilterP: (type: string) => void;
}

function FilterBar(props: FilterBarProps) {
  const [currentSort, setCurrentSort] = useState<string>("ltm");

  //Handles when the user clicks on a filter checkbox
  const handleLockView = (type: React.Key) => {
    props.setVisibleFilterP(type as string);
  };

  //Handles when the user clicks on the filter drop down menu
  const handleFilterClick = (item: React.Key) => {
    //Local change
    setCurrentSort(item as string);
    //Send to achievements list
    props.setSortFilterP(item as string);
  };

  return (
    <div className="flex flex-rows items-center px-3 gap-4">
      <div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              //onClick={handleFilterClick}
              variant="solid"
              startContent={<SortIcon />}
            >
              {currentSort === "ltm"
                ? "Least to Most Rare"
                : "Most to Least Rare"}
            </Button>
          </DropdownTrigger>

          {/*Sort Button Dropdown menu*/}
          <DropdownMenu
            aria-label="Static Actions"
            onAction={handleFilterClick}
          >
            <DropdownItem key="ltm">Least to Most Rare</DropdownItem>
            <DropdownItem key="mtl">Most to Least Rare</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div>
        <Tabs
          onSelectionChange={handleLockView}
          key="bordered"
          variant="bordered"
          aria-label="filter-bar-tabs"
        >
          <Tab key="default" title="Default" />
          <Tab
            key="unlocked"
            title={
              <div className="flex items-center space-x-2">
                <LockOpenIcon />
                <span>Unlocked</span>
              </div>
            }
          />
          <Tab
            key="locked"
            title={
              <div className="flex items-center space-x-2">
                <LockIcon />
                <span>Locked</span>
              </div>
            }
          />
        </Tabs>
      </div>
    </div>
  );
}

export default FilterBar;
