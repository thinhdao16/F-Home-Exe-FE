import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { DataContext } from '../../pages/DataContext';
import { UserAuth } from './AuthContext';

// eslint-disable-next-line react/prop-types
const Protected = ({ children }) => {
  // const { user } = UserAuth();
  const {user} = useContext(DataContext)
  if (!user) {
    return <Navigate to='/' />;
  }

  return children
};

export default Protected;
