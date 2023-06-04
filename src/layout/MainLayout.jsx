import React, { useContext } from 'react'
import './main-layout.scss'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import TopNav from '../components/topnav/TopNav'
// import { DataContext } from '../pages/DataContext'

const MainLayout = () => {
    // const {posting } = useContext(DataContext);
    // console.log('1',posting)
    
    return (
        <>
            <Sidebar />
            <div className="main">
                <div className="main__content">
                    <TopNav />
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default MainLayout
