import { CustomCarousal as Carousel } from '@components/common/Carousel';
import Hero from '@components/home/Hero';

import MainLayout from '@components/layout/MainLayout';
import { cardsContentTestData } from 'lib/mockContent';

function Home() {
    return (
        <MainLayout
            layoutProps={{
                title: 'Home | Reconstruction',
            }}
        >
            <Hero />
            <div className="container">
                <Carousel contents={cardsContentTestData} />
            </div>
        </MainLayout>
    );
}
export default Home;
