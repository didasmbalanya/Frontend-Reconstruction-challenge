
import Hero from "@components/home/Hero";

import MainLayout from "@components/layout/MainLayout";


function Home() {
    return (
        <MainLayout
            layoutProps={{
                title: 'Home | Reconstruction',
            }}
        >
            <Hero />
            <div className="container">
                { /** place component here **/}
            </div>

        </MainLayout>
    );
}
export default Home
