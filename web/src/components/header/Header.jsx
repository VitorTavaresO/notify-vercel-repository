import React, { useState, useEffect, useRef } from "react";
import './Header.css';
import { useNavigate } from "react-router-dom";
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';

const Header = () => {
    const navigate = useNavigate();

    const items = [
        {label: 'Início',
            command: () => { navigate('/'); }
         },
        {label: 'Comunicados', command: () => { navigate('/announcement-list'); }},
        {label: 'Responsáveis', command: () => { navigate('/guardian-list'); }},
        {label: 'Servidores', command: () => { navigate('/employee-list'); }},
    ];

    const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
    const userMenuRef = useRef(null);
    const userMenuItems = [
        {label: 'Perfil',
            command: () => { navigate('/profile'); }
        },
        {label: 'Sair',
            command: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        },
    ];

    const toggleUserMenu = () => { setIsUserMenuVisible(prevState => !prevState);};

    const handleClickOutside = (event) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) { setIsUserMenuVisible(false);}
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            localStorage.setItem('userRole', user.role);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    const start = (
        <div className="flex align-items-center ml-3 mr-3 logo">
            <img alt="logo" src="/images/logo_ifpr.png" height="46" />
        </div>
    );
    const end = (
        <div className="flex align-items-center mr-3 relative" ref={userMenuRef}>
            <Avatar 
                image="/images/default_pic.png"
                shape="circle"
                className="mr-2 avatar"       
                onClick={toggleUserMenu}
            />
            <Button icon="pi pi-chevron-down" className="p-button-text -ml-2 mr-1 dropdown-icon" onClick={toggleUserMenu} />
            {isUserMenuVisible && ( <div className="user-menu">
                {userMenuItems.map((item, index) => (
                    <div key={index} className="user-menu-item" onClick={item.command}> {item.label} </div>
                ))}
            </div> )}
        </div>
    );

    return (
        <>
        <Menubar model={items} start={start} end={end} className="header"/>
        </>
    );
}; 

export default Header;