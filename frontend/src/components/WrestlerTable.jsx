import React, { useState, useEffect, useMemo } from 'react'

import { motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import styled, {keyframes} from 'styled-components';
import { useQuery } from '@tanstack/react-query';


const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
	margin: 16px;
	animation: ${rotate360} 1s linear infinite;
	transform: translateZ(0);
	border-top: 2px solid grey;
	border-right: 2px solid grey;
	border-bottom: 2px solid grey;
	border-left: 4px solid black;
	background: transparent;
	width: 80px;
	height: 80px;
	border-radius: 50%;
`;

const CustomLoader = () => (
	<div style={{ padding: '24px' }}>
		<Spinner />
		<div>Loading Champions...</div>
	</div>
);


const columns = [
    {
        name: 'Name',
        selector: row => row.name,
        sortable: true,
        cell: row => (
        <span 
        style = {{
            fontWeight: 'bold'
        }}>
            {row.name}
        </span>
        )
    },
    {
        name: 'Championship',
        selector: row => row.championship,
        sortable: false,
        wrap: true,
        cell: row => (
      <span style={{
        color: 'yellow',
        fontWeight: 'bold',
      }}>
        {row.championship}
      </span>
    ),
    },
    {
        name: 'Reigns',
        selector: row => row.totalReigns,
        sortable: true,
        cell: row => (
        <span 
        style = {{
            fontWeight: 'bold'
        }}>
            {row.totalReigns}
        </span>
        )
    },
    {
        name: 'Total Days Held',
        selector: row => row.totalDaysHeld,
        sortable: true,
        cell: row => (
        <span 
        style = {{
            fontWeight: 'bold'
        }}>
            {row.totalDaysHeld}
        </span>
        )
    },
];


const fetchWrestlers = async () => {
  const res = await fetch('http://localhost:5000/api/wrestlers');
  if (!res.ok) {
    throw new Error('Failed to fetch wrestlers');
  }
  return res.json();
};

export const WrestlerTable = () => {
    
    const [searchTerm, setSearchTerm] = useState('');
    
    
    
    const {data = [], isLoading} = useQuery({
        queryKey:["wweChampions"],
        queryFn: fetchWrestlers,
    })
    




    // isNumberSearch is used to check if the search is for a number or not.
    // REGEX: /^\d+$/
    // Explanation:
    /////////////////////// 
    // ^ Asserts position at start of string
    // \d Matches a digit - Equivalent to [0-9]
    // $ Asserts position at the end of string
    // Combinding ^ and $ makes it so we can check for anything that isn't a number between 0-9
    ///////////////////////

    const rawSearch = searchTerm.replace(/,/g,'');   //Removes commas  example: "4000"
    const isNumberSearch = /^\d+$/.test(rawSearch);  // Test if the rawSearch matches the regex


    const filteredData = data.filter(wrestler => {
        const term = searchTerm.toLowerCase();

        const nameSearch = wrestler.name.toLowerCase().includes(term);

        let daysSearch = false;
        
        if(isNumberSearch) {
            
            const numberSearched = parseInt(rawSearch,10);

            if(rawSearch.length === 1){
                daysSearch = wrestler.totalDaysHeld.toString().includes(rawSearch);
            } else {
                let window;
                if(rawSearch.length === 2){
                    
                    window = 10;
                } 
                else if (rawSearch.length === 3){
                    window = 100;
                } 
                else if (rawSearch.length === 4) {
                    window = 1000
                    
                }

                daysSearch = Math.abs(wrestler.totalDaysHeld - numberSearched) <= window;

            } 
        }

        return nameSearch || daysSearch 
    });
    
    return (
        
        <div>
            <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <input
                placeholder="Search"
                type = "text"
                value = {searchTerm}
                onChange = {(e) => setSearchTerm(e.target.value)}
                className = "form-control-sm border ps-3"
                style = {{width:'100%',maxWidth:'400px',marginBottom:'1rem',padding:'0.5rem 1rem', fontSize: '1rem',borderRadius:'8px',border:'1px solid #444',background:'#111',color:'#fff'
                }}

            />
            
            <DataTable
                columns={columns}
                data={filteredData}
                progressPending={isLoading}
                progressComponent={<CustomLoader />}
                highlightOnHover
                striped
                
                theme = "dark"
            />
            </motion.div>


        </div>
        
    );

};
