import React from 'react';
import Carousel from 'react-elastic-carousel';

const SimpleItem = ({ children }) => {
    return (
        <div
            style={{
                cursor: 'pointer',
                transition: 'transform 200ms ease',
                boxSizing: 'border-box',
                width: '100%',
                height: '100%',
                padding: '15px',
                margin: '20px',
                color: '#fff',
                backgroundColor: 'purple',
                display: 'flex',
                minHeight: '300px',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2.5em',
            }}
        >
            {children}
        </div>
    );
};

export default () => {
    // TODO - replace with children
    return (
        <Carousel itemsToShow={2} isRTL={false}>
            <SimpleItem>1</SimpleItem>
            <SimpleItem>2</SimpleItem>
            <SimpleItem>3</SimpleItem>
            <SimpleItem>4</SimpleItem>
            <SimpleItem>5</SimpleItem>
            <SimpleItem>6</SimpleItem>
        </Carousel>
    );
};
