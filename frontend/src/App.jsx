import React, { useState, useEffect, useMemo } from 'react'
import './App.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styled from '@emotion/styled';
import { WrestlerTable } from './components/WrestlerTable.jsx';



const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color:rgb(228, 224, 224);
  margin-bottom: 2rem;
`;


function App() {
    return (
    
    <div style={{  margin: 'auto', paddingTop: '2rem' }}>
        <Title>Pro Wrestling Champions</Title>
        <WrestlerTable />
    </div>
    

    );
}

export default App
