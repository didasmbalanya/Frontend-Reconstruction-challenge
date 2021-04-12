import { CardsContent } from "@components/common/Carousel";

const Longtext: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ...';

export const cardsContentTestData: CardsContent[] = [
    { courseType: 'reading', level: '2nd - 3rd Grade', text: Longtext, title: 'This is a One Line Title' },
    {
        courseType: 'reading',
        level: '2nd - 3rd Grade',
        text: Longtext,
        title: 'This is a One Line Title (But, now it’s a two line title)',
    },
    { courseType: 'reading', level: '2nd - 3rd Grade', text: Longtext, title: 'This is a One Line Title' },
    {
        courseType: 'reading',
        level: '2nd - 3rd Grade',
        text: Longtext,
        title: 'This is a One Line Title (But, now it’s a two line title)',
    },
];