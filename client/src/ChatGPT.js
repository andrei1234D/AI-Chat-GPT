import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatGPT.css';
import { FaRegUser } from 'react-icons/fa';
import { RiRobot2Line } from 'react-icons/ri';

export default function ChatGPT() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const HTTP = 'http://localhost:8080/chat';

  useEffect(() => {
    if (currentResponse) {
      let typingInterval;
      const typingSpeed = 10; // Milliseconds per character
      let currentText = '';
      let index = 0;

      typingInterval = setInterval(() => {
        currentText += currentResponse.charAt(index);
        setResponses((prevResponses) =>
          prevResponses.map((resp, i) =>
            i === prevResponses.length - 1
              ? { ...resp, botResponse: currentText }
              : resp
          )
        );
        index++;
        if (index === currentResponse.length) {
          clearInterval(typingInterval);
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    }
  }, [currentResponse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${HTTP}`, { prompt, conversation: responses }) // Sending conversation history to BE
      .then((res) => {
        setResponses([...responses, { promptUser: prompt, botResponse: '' }]);
        setCurrentResponse(res.data);
        setPrompt('');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="container ">
      <div className="title text-center text-darkGreen">
        Find your Desired Documentaries
      </div>
      <div className="chat-container bg-darkGreen mt-2 border-5">
        {responses.length > 0 &&
          responses.map((response, index) => (
            <div key={index} className="response">
              <div
                className={`text-light-user textBorder ${
                  index === responses.length - 1 ? 'animationUser' : ''
                }`}
              >
                <FaRegUser size={50} className="icon" />
                <p className="userText">{response.promptUser}</p>
              </div>
              <div
                className={`textBorder textBorderResponse text-light-user ${
                  index === responses.length - 1 ? 'animationBot' : ''
                }`}
              >
                <p className="text-light">{response.botResponse}</p>
                <RiRobot2Line size={50} className="icon" />
              </div>
            </div>
          ))}

        <div className="form-group">
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <textarea
              className="input"
              placeholder={isFocused ? '' : 'Ask me Anything...'} // Placeholder changes when input is focused
              value={prompt}
              onChange={handlePrompt}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              rows={1} // Initial rows
              style={{
                width: '50%',
                borderRadius: '40px',
                padding: '1rem',
                resize: 'none', // Prevents manual resizing by the user
                overflow: 'hidden',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
