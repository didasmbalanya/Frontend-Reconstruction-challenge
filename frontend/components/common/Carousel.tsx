import React from 'react';
import Carousel from 'react-elastic-carousel';
import { CourseCard } from './CourseCard';
export interface CardsContent {
    courseType: string;
    level: string;
    title: string;
    text: string;
}
export const CustomCarousal = ({ contents }: { contents: CardsContent[] }) => {
    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 600, itemsToShow: 2 },
        { width: 850, itemsToShow: 3 },
        { width: 1150, itemsToShow: 4 },
        { width: 1450, itemsToShow: 5 },
        { width: 1750, itemsToShow: 6 },
    ];
    
    return (
        <Carousel itemsToShow={3} isRTL={false} breakPoints={breakPoints}>
            {contents.map((content, idx) => {
                return (
                    <CourseCard
                        key={idx + content.title}
                        courseType={content.courseType}
                        level={content.level}
                        title={content.title}
                        text={content.text}
                    />
                );
            })}
        </Carousel>
    );
};
