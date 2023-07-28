import React, { useContext } from 'react'
import './main-layout.scss'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import TopNav from '../components/topnav/TopNav'
import { AuthContext } from '../components/context/AuthContext'
import Loading from "react-fullscreen-loading";

const MainLayout = () => {

    const{loadingGlobal} = useContext(AuthContext)
    return (
        <>
          <>
        {loadingGlobal && (
          <Loading loading background="#fff" loaderColor="#ff9066" />
        )}
        {  
<>        
        <Sidebar />
            <div className="main">
                <div className="main__content">
                    <TopNav />
                    <Outlet />
                </div>
            </div>
            </>
            }
      </>
         
        </>
    )
}

export default MainLayout
