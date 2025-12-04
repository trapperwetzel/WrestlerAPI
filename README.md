# WrestlerAPI

WrestlerAPI is a full-stack application for exploring professional wrestling championship history.  
It uses a Node.js/Express backend, PostgreSQL database, and a React + Vite frontend.

## Overview

- Fetches and merges title histories from multiple Wiki sources  
- Normalizes wrestler identities and championship data  
- Stores aggregated results in PostgreSQL  
- Serves data through `/api/wrestlers`  
- Interactive frontend with sorting, searching, and expandable details  

## Features

- Multi-promotion championship data (WWE, AEW, WCW, NXT, TNA, etc.)
- Total reigns and total days held per wrestler
- Detailed title histories per wrestler
- Fast, filterable data table UI (React Data Table)
- PostgreSQL-backed dataset for persistence and querying

## Tech Stack

**Backend:** Node.js, Express, PostgreSQL, JSDOM, node-fetch  
**Frontend:** React 19, Vite, React Query, React Data Table, Framer Motion, Styled Components  

## Getting Started
git clone git@github.com:trapperwetzel/WrestlerAPI.git
cd WrestlerAPI

npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

cd backend
npm run seed

npm run dev
