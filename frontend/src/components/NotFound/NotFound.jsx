import React, { useEffect, useRef } from "react";
import "./NotFound.scss";
import { Ghost } from 'lucide-react';
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="main">
        <h1>4<span><i className="fas fa-ghost"><Ghost size={200}/></i></span>4</h1>
        <h2>Error: 404 page not found</h2>
        <p>Sorry, the page you're looking for cannot be accessed</p>
        <Link to='/'>
            <button className='downloadBtn'>
                Go back to the main page
            </button>
        </Link>
    </main>
  )
};

export default NotFoundPage;
