//import {useEffect, useState} from "react";


import {AppBar, Box, Button, Checkbox, FormControlLabel, Menu, MenuItem} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import React, {useState} from "react";
import "../styles/FilterBar.css"

interface FilterBarProps {
    setSortFilterP: (type : number) => void,
    setVisibleFilterP: (index : number) => void
}

function FilterBar(props : FilterBarProps){

    const [currentSort, setCurrentSort] = useState<string>("Most to Least Rare")
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    /*Button Handlers*/
    const sortOpen = Boolean(anchorEl);

    //Handles when the user clicks on a filter checkbox
    const handleCheckBox = (index : number) => {
        props.setVisibleFilterP(index);
    }

    //Handles when the user clicks on the filter drop down menu
    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    //Handles when the filter dropdown menu is closed
    const handleClose = (n : number) => {
        //Close filter when a filter choice is selected and do stuff
        const labels = ["Most to Least Rare", "Least To Most Rare"];
        setAnchorEl(null)
        if(n != -1){
            props.setSortFilterP(n)
            setCurrentSort(labels[n])
        }
    };


    return (

        <AppBar className = "achievement-filters" position="static">
            <Box display="flex" alignItems="center">

                {/*Filter Button*/}
                <Button
                    id="basic-button"
                    onClick={handleFilterClick}
                    variant="contained"
                    startIcon = {<SortIcon />}
                >
                    {currentSort}
                </Button>

                {/*Sort Button Dropdown menu*/}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={sortOpen}
                    onClose={() => handleClose(-1)}
                >
                    <MenuItem onClick={() =>handleClose(0)}>Most to Least Rare</MenuItem>
                    <MenuItem onClick={() =>handleClose(1)}>Least to Most Rare</MenuItem>
                </Menu>

                {/*Hide Locked Checkbox*/}
                <FormControlLabel
                    control={
                        <Checkbox
                            name="Show Locked"
                            onChange = {() => handleCheckBox(0)}
                            style = {{color: "white"}}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    }
                    label="Hide Locked"
                    style={{ marginLeft: '10px' }} // Adjust spacing as needed
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            name="Show Locked"
                            onChange = {() => handleCheckBox(1)}
                            style = {{color: "white"}}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    }
                    label="Hide Unlocked"
                    style={{ marginLeft: '10px' }} // Adjust spacing as needed
                />

            </Box>
        </AppBar>
    )
}

export default FilterBar