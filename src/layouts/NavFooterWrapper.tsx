import React from 'react';
import NavAndFooter from './NavAndFooter';

const withNavAndFooter = (Component: React.ComponentType<any>) => {
    return (props: any) => (
        <NavAndFooter>
            <Component {...props} />
        </NavAndFooter>
    );
};

export default withNavAndFooter;
