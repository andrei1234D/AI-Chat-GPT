import React, { useState } from 'react';
import axios from 'axios';
import './ChatGPT.css';
import Button from '@mui/material/Button';

export default function ChatGPT() {
  const [prompt, setPrompt] = useState('how are you');
  const [response, setResponse] = useState('');
  const HTTP = 'http://localhost:8080/chat';

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${HTTP}`, { prompt })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setPrompt('how are you');
  };

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="container container-sm p-1">
      <h1 className="title text-center text-darkGreen">ChatGPT API</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="">Ask questions</label>
          <input
            className="shadow-sm"
            type="text"
            placeholder="Enter text"
            value={prompt}
            onChange={handlePrompt}
          />
        </div>
        <Button variant="contained" type="submit">
          Go
        </Button>
      </form>
      <div className="bg-darkGreen  mt-2 p-1 border-5">
        <p className="text-light">
          {response ? response : 'Ask me anything...'}
        </p>
      </div>
    </div>
  );
}
