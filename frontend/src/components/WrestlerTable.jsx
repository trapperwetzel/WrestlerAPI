import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import { useQuery } from '@tanstack/react-query';


const rotate360 = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const Spinner = styled.div`
  margin: 16px;
  animation: ${rotate360} 1s linear infinite;
  border: 4px solid transparent;
  border-top-color: black;
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;
const CustomLoader = () => (
  <div style={{ padding: 24, textAlign: 'center' }}>
    <Spinner />
    <div>Loading champions…</div>
  </div>
);


const ExpandedChampList = ({ data }) => (
  <table style={{ width: '100%', padding: '.5rem' }}>
    <thead>
      <tr>
        <th style={{ textAlign: 'left' }}>Championship</th>
        <th>Reigns</th>
        <th>Days Held</th>
      </tr>
    </thead>
    <tbody>
      {data.championships.map(ch => (
        <tr key={ch.championshipName}>
          <td>{ch.championshipName}</td>
          <td style={{ textAlign: 'center' }}>{ch.totalReigns}</td>
          <td style={{ textAlign: 'center' }}>{ch.totalDaysHeld}</td>
        </tr>
      ))}
    </tbody>
  </table>
);


const fetchWrestlers = async () => {
  const res = await fetch('http://localhost:5000/api/wrestlers');
  if (!res.ok) throw new Error('Failed to fetch wrestlers');
  return res.json();
};

export const WrestlerTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  
  const { data: wrestlers = [], isLoading } = useQuery({
    queryKey: ['wweChampions'],
    queryFn: fetchWrestlers
  });

  
  const enriched = useMemo(
    () =>
      wrestlers.map(w => ({
        ...w,
        championshipsStr: w.championships
          .map(c => c.championshipName)
          .join(', ')
      })),
    [wrestlers]
  );

  
  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return enriched;

    const numeric = Number(term.replace(/,/g, ''));
    const isNumber = !Number.isNaN(numeric);

    return enriched.filter(w => {
      const nameMatch  = w.name.toLowerCase().includes(term);
      const titleMatch = w.championshipsStr.toLowerCase().includes(term);
      const numMatch   =
        isNumber &&
        (w.totalReignsAll === numeric || w.totalDaysAll === numeric);
      return nameMatch || titleMatch || numMatch;
    });
  }, [searchTerm, enriched]);

  
  const columns = [
  { name: 'Name', selector: r => r.name, sortable: true, id: 'name' },
  { name: 'Championships', selector: r => r.championshipsStr, sortable: true },
  { name: 'Total Reigns',  selector: r => r.totalReignsAll,   sortable: true },
  {             
    name: 'Total Days',
    selector: r => r.totalDaysAll,
    sortable: true,
    id: 'days'
  }
];

  
  return (
    <div>
      
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="form-control-sm border ps-3"
          style={{
            width: '100%',
            maxWidth: 400,
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: 8,
            border: '1px solid #444',
            background: '#111',
            color: '#fff'
          }}
        />

        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={isLoading}
          progressComponent={<CustomLoader />}
          highlightOnHover
          striped
          theme="dark" 
          expandableRows
          expandableRowsComponent={ExpandedChampList}
          defaultSortFieldId="days"
          defaultSortAsc={false}
        />
      
    </div>
  );
};
