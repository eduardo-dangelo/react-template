import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import AddButton from './components/AddButton';
import loadImage, { LoadImageResult } from 'blueimp-load-image';
import { API_KEY, API_URL, BASE64_IMAGE_HEADER } from './Constants';
import {
  Alert, Box,
  Collapse, IconButton,
  ImageList,
  ImageListItem,
  List,
  ListItemButton,
  ListItemIcon, ListItemText,
  ListSubheader
} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = React.useState<boolean>(true);

  let uploadImageToServer = (file: File) => {
    loadImage(
      file,
      {
        maxWidth: 400,
        maxHeight: 400,
        canvas: true
      })
      .then(async (imageData: LoadImageResult) => {
        let image = imageData.image as HTMLCanvasElement

        let imageBase64 = image.toDataURL("image/png")
        let imageBase64Data = imageBase64.replace(BASE64_IMAGE_HEADER, "")
        let data = {
          image_file_b64: imageBase64Data,
        }
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify(data)
        });

        setLoading(false)
        if (response.status >= 400 && response.status < 600) {
          const errorMessage = 'Bad response from server'
          setError(errorMessage)
          throw new Error(errorMessage);
        }

        const result = await response.json();
        const base64Result = BASE64_IMAGE_HEADER + result.result_b64
        setResults([...results, base64Result])
      })
      .catch(error => {
        console.error(error)
      })
  }

  let onImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setError(null)
      setLoading(true)
      uploadImageToServer(e.target.files[0])
    } else {
      setError('No file was picked')
    }
  }

  const handleAddFolder = () => {
    // todo: handle add folder
  }

  return (
    <div className="App">
      <header className="App-header">
        <AddButton onImageAdd={onImageAdd} loading={loading}/>
        <div>
          <Collapse in={!!error}>
            <Alert severity="error" >{error}</Alert>
          </Collapse>
          <Collapse in={loading}>
            <Alert severity="info" >...Uploading</Alert>
          </Collapse>
        </div>
      </header>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            flex: 1
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Images
            </ListSubheader>
          }
        >
          <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemIcon>
              <FolderOpenIcon/>
            </ListItemIcon>
            <ListItemText primary="Untitled Folder"/>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {results.map((result, index) => (
              <List component="div" disablePadding key={index}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <img src={result} alt="result from the API" width={30}/>
                  </ListItemIcon>
                  <ListItemText primary={`Image 0${index + 1}`} />
                </ListItemButton>
              </List>
            ))}
          </Collapse>
          <ListItemButton onClick={handleAddFolder}>
            <ListItemText primary="Add Folder"/>
            <IconButton aria-label="delete" size="small" edge="end">
              <AddIcon/>
            </IconButton>
          </ListItemButton>
        </List>
        <ImageList
          sx={{
            flex: 6,
            maxWidth: 900,
            height: '100vh',
            margin: 'auto',
          }}
          cols={3}
          rowHeight={164}
        >
          {results.map((result, index) => (
            <ImageListItem key={index}>
              <img src={result} alt="result from the API"/>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </div>
  );
}

export default App;
