// src/GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #0f0f0f;
    color: #fff;
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }

  input, button {
    border: none;
    outline: none;
    border-radius: 6px;
    padding: 10px;
    font-size: 16px;
  }

  input {
    background-color: #1c1c1c;
    color: white;
    border: 1px solid #333;
  }

  button {
    background-color: #2563eb;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  button:hover {
    background-color: #1d4ed8;
  }

  a {
    color: #60a5fa;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export default GlobalStyle;