import React, { useState, useEffect, useMemo } from 'react'
import './App.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styled from '@emotion/styled';
import { WrestlerTable } from './components/WrestlerTable.jsx';
const Title = styled.h1`
    text-align: center;
    font-color: white;
`;


function App() {
    return (
    <div style={{ maxWidth: 1000, margin: 'auto', paddingTop: '2rem' }}>
        <Title>Pro Wrestling Champions</Title>
        <WrestlerTable />
    </div>

    );
}

export default App
