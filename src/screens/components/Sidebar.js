import React from 'react'
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';

export function Sidebar() {
    return (
        <div className="fixed_sidebar">
            <h3 className='head_text mt-5 mb-3 App'>Menu</h3>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
        </div>
    )
}
export default Sidebar;