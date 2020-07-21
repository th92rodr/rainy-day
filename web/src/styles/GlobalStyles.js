import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }
  html, border-style, #root {
    max-height: 100vh;
    max-width: 100vw;

    width: 100%;
    height: 100%;
  }
  *, button, input {
    border: 0;
    background: none;
    font-family: 'Montserrat', sans-serif;
  }
  html {
    background: var(--ghostWhite);
  }
  ul {
    list-style: none;
  }
  a {
    text-decoration: none;
    cursor: pointer;
  }
  button {
    cursor: pointer;
  }
  :root {
    --ghostWhite: #fafaff;
  }
`;
