import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <h2>404 - Không tìm thấy trang</h2>
      <Link to="/" style={{ color: '#0d6efd', textDecoration: 'none' }}>
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;