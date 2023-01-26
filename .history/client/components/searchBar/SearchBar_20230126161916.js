import React from 'react'
import { TextField, Box, Select, MenuItem } from "@mui/material"

const SearchBar = () => {
  return (
    // will switch box to formControl
    <Box
    component="form"
    variant="contained"
    sx={{ p: 2, border: '1px solid grey' }}
    >
      {/* //Location Field */}
      <TextField id="outlined-basic" label="Location" variant="outlined" sx={{'& > :not(style)': { m: 1, width: '25ch'}}}/>

      {/*Seats*/}
      <InputLabel id="numberOfGuests-dropdown">Number of Guests</InputLabel>
      <Select
        labelId="numberOfGuests-dropdown"
        id="numberOfGuests-dropdown"
        label="Number of Guests"
      >
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={}>4</MenuItem>
      </Select>

      {/*Pick a Date - calendar*/}
      <TextField id="outlined-basic" label="Location" variant="outlined" sx={{'& > :not(style)': { m: 1, width: '25ch'}}}/>

      {/*Distance*/}
      <TextField id="outlined-basic" label="Distance" variant="outlined" sx={{'& > :not(style)': { m: 1, width: '25ch'}}}/>
    </Box>
  )
}

export default SearchBar
