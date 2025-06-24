import React, { useState, useEffect, useMemo } from 'react'
import fetchWWEChampions from './APICall.jsx'
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
    },
    {
        name: 'Championship',
        selector: row => row.championship.map(c=>c.title).join(','),
        sortable: false,
        wrap: true,
    },
    {
        name: 'Reigns',
        selector: row => row.totalReigns,
        sortable: true,
    },
    {
        name: 'Total Days Held',
        selector: row => row.totalDaysHeld,
        sortable: true,
        format: row => row.totalDaysHeld.toLocaleString(),
    },
];



export const WrestlerTable = () => {
    
    const [searchTerm, setSearchTerm] = useState('');
    
    
    
    const {data = [], isLoading} = useQuery({
        queryKey:["wweChampions"],
        queryFn: fetchWWEChampions,
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

            <input
                placeholder="Search"
                type = "text"
                value = {searchTerm}
                onChange = {(e) => setSearchTerm(e.target.value)}
                className = "form-control-sm border ps-3"
            />

            <DataTable
                columns={columns}
                data={filteredData}
                progressPending={isLoading}
                progressComponent={<CustomLoader />}
                //pagination
                //paginationPerPage={20}
                highlightOnHover
                dense
                striped
                fixedHeader
                title = "WWE Champions"
            />



        </div>
        
    );

};
