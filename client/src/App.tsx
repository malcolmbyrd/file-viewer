import React from "react";

import Box from "@material-ui/core/Box";

import DataGrid from './DataGrid'
import "./App.css";
import DataTable from "./components/DataTable";

function App() {
  return (
      <Box
        component="main"
        className="App-main"
        p={2}
        mt={6}
        mx="auto"
        maxWidth={1200}
      >
        <DataGrid />
        <DataTable />
      </Box>
  );
}

App.whyDidYouRender = true
export default App;
