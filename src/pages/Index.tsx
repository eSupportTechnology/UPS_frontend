import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/super-admin" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Sales</span>
                </li>
            </ul>


        </div>
    );
};

export default Index;
