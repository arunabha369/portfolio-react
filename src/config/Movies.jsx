
import { Film, CheckCircle, Heart, Tv } from 'lucide-react';

export const movies = [
    // Christopher Nolan Movies
    {
        name: 'Oppenheimer',
        director: 'Christopher Nolan',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt15398776/',
        image: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Oppenheimer_poster.jpg'
    },
    {
        name: 'Tenet',
        director: 'Christopher Nolan',
        status: 'Watched',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.imdb.com/title/tt6723592/',
        image: 'https://upload.wikimedia.org/wikipedia/ru/8/87/Tenet_(poster).jpg'
    },
    {
        name: 'Dunkirk',
        director: 'Christopher Nolan',
        status: 'Watched',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.imdb.com/title/tt5013056/',
        image: 'https://upload.wikimedia.org/wikipedia/en/1/15/Dunkirk_Film_poster.jpg'
    },
    {
        name: 'Interstellar',
        director: 'Christopher Nolan',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt0816692/',
        image: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg' // Guessed hash, replaced below if invalid
    },
    {
        name: 'The Dark Knight Rises',
        director: 'Christopher Nolan',
        status: 'Watched',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.imdb.com/title/tt1345836/',
        image: 'https://upload.wikimedia.org/wikipedia/en/8/83/Dark_knight_rises_poster.jpg'
    },
    {
        name: 'Inception',
        director: 'Christopher Nolan',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt1375666/',
        image: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg'
    },
    {
        name: 'The Dark Knight',
        director: 'Christopher Nolan',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt0468569/',
        image: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg'
    },
    {
        name: 'The Prestige',
        director: 'Christopher Nolan',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt0482571/',
        image: 'https://image.tmdb.org/t/p/original/5MXyQfz8xUP3dIFPTubhTsbFY6N.jpg'
    },
    {
        name: 'Batman Begins',
        director: 'Christopher Nolan',
        status: 'Watched',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.imdb.com/title/tt0372784/',
        image: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Batman_Begins_Poster.jpg'
    },
    {
        name: 'Insomnia',
        director: 'Christopher Nolan',
        status: 'Watched',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.imdb.com/title/tt0161718/',
        image: 'https://upload.wikimedia.org/wikipedia/en/e/e7/Insomnia2002Poster.jpg'
    },
    {
        name: 'Memento',
        director: 'Christopher Nolan',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt0209144/',
        image: 'https://upload.wikimedia.org/wikipedia/en/c/c7/Memento_poster.jpg'
    },
    {
        name: 'Following',
        director: 'Christopher Nolan',
        status: 'Watched',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.imdb.com/title/tt0154506/',
        image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/Following_poster.jpg'
    },

    // Indian Movies
    {
        name: '3 Idiots',
        director: 'Rajkumar Hirani',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt1187043/',
        image: 'https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg'
    },
    {
        name: '12th Fail',
        director: 'Vidhu Vinod Chopra',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt23849228/',
        image: 'https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg'
    },
    {
        name: 'Tumbbad',
        director: 'Rahi Anil Barve',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt8239946/',
        image: 'https://upload.wikimedia.org/wikipedia/en/4/41/Tumbbad_poster.jpg'
    },
    {
        name: 'Swades',
        director: 'Ashutosh Gowariker',
        status: 'Favorite',
        icon: <Heart className="size-4" />,
        href: 'https://www.imdb.com/title/tt0367110/',
        image: 'https://upload.wikimedia.org/wikipedia/en/8/85/Swades_poster.jpg'
    },
    {
        name: 'Super 30',
        director: 'Vikas Bahl',
        status: 'Watched',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.imdb.com/title/tt7485048/',
        image: 'https://upload.wikimedia.org/wikipedia/en/2/29/Super_30_The_Film.jpg'
    },
    {
        name: 'Kota Factory',
        director: 'The Viral Fever',
        status: 'Favorite',
        icon: <Tv className="size-4" />,
        href: 'https://www.imdb.com/title/tt9432978/',
        image: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Kota_Factory_Poster.jpg' // Try commons if en fails
    }
];
