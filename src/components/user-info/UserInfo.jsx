import React from 'react'
import './user-info.scss'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
const UserInfo = ({ user }) => {
    return (
        <div className='user-info'>
            {/* <div className="user-info__img">
              <SearchOutlinedIcon/>
            </div> */}
            <div className="user-info__name">
                {/* <span>{user.name}</span> */}
                <SearchOutlinedIcon/>
                <input></input>
            </div>
        </div>
    )
}

export default UserInfo
