import React from 'react'
import { TextField, Box } from "@mui/material"

const SearchBar = () => {
  return (
    <Box
    component="form"
    sx={{m: 1, width: '25ch'}}
    >
      <TextField id="outlined-basic" label="Location" variant="outlined"/>
    </Box>
  )
}

export default SearchBar
