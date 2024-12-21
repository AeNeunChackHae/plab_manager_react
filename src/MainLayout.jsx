import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/shared/Header';

const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet /> {/* 중첩된 라우트 렌더링 */}
            </main>
        </>
    );
};

export default MainLayout;
