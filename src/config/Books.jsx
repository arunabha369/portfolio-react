
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

export const books = [
    {
        name: 'Atomic Habits',
        author: 'James Clear',
        status: 'Reading',
        icon: <Clock className="size-4" />,
        href: 'https://jamesclear.com/atomic-habits',
        image: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg'
    },
    {
        name: 'The Psychology of Money',
        author: 'Morgan Housel',
        status: 'Completed',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681',
        image: 'https://m.media-amazon.com/images/I/81Dky+tD+pL._AC_UF1000,1000_QL80_.jpg'
    },
    {
        name: 'Deep Work',
        author: 'Cal Newport',
        status: 'Completed',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.calnewport.com/books/deep-work/',
        image: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg'
    },
    {
        name: 'Clean Code',
        author: 'Robert C. Martin',
        status: 'Completed',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
        image: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg'
    },
    {
        name: 'Zero to One',
        author: 'Peter Thiel',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296',
        image: 'https://m.media-amazon.com/images/I/71uAI28kJuL._AC_UF1000,1000_QL80_.jpg'
    },
    {
        name: '48 Laws of Power',
        author: 'Robert Greene',
        status: 'Completed',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.amazon.com/48-Laws-Power-Robert-Greene/dp/0140280197',
        image: 'https://m.media-amazon.com/images/I/71aG+xDKSYL._AC_UF1000,1000_QL80_.jpg'
    },
    {
        name: 'Ikigai',
        author: 'Héctor García and Francesc Miralles',
        status: 'Completed',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.amazon.com/Ikigai-Japanese-Secret-Long-Happy/dp/0143130722',
        image: 'https://m.media-amazon.com/images/I/81l3rZK4lnL._AC_UF1000,1000_QL80_.jpg'
    },
    {
        name: 'The Subtle Art of Not Giving a F*ck',
        author: 'Mark Manson',
        status: 'Completed',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.amazon.com/Subtle-Art-Not-Giving-Counterintuitive/dp/0062457713',
        image: 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_UF1000,1000_QL80_.jpg'
    },
    {
        name: 'How to Win Friends and Influence People',
        author: 'Dale Carnegie',
        status: 'Completed',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.amazon.com/How-Win-Friends-Influence-People/dp/0671027034',
        image: 'https://covers.openlibrary.org/b/isbn/9780671027032-L.jpg'
    },
    {
        name: 'Think Like a Monk',
        author: 'Jay Shetty',
        status: 'Completed',
        icon: <CheckCircle className="size-4" />,
        href: 'https://www.amazon.com/Think-Like-Monk-Train-Purpose/dp/1982134488',
        image: 'https://covers.openlibrary.org/b/isbn/9781982134488-L.jpg'
    },
    {
        name: 'Bhagavad Gita',
        author: 'Ved Vyasa',
        status: 'Completed',
        icon: <CheckCircle className="size-4" />,
        href: 'https://amzn.in/d/5ItzTbm',
        image: '/assets/books/bhagavad-gita.jpg'
    },
    {
        name: 'Mastery',
        author: 'Robert Greene',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Mastery-Robert-Greene/dp/0143124119',
        image: 'https://m.media-amazon.com/images/I/71LRdEUOmNL._AC_UF1000,1000_QL80_.jpg'
    },
    {
        name: "Can't Hurt Me",
        author: 'David Goggins',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Cant-Hurt-Me-Master-Your/dp/1544512279',
        image: 'https://m.media-amazon.com/images/I/81gTRv2HXrL._AC_UF1000,1000_QL80_.jpg'
    },
    {
        name: 'Unfuck Yourself',
        author: 'Gary John Bishop',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Unfu-k-Yourself-Your-Head-into/dp/0062803832',
        image: 'https://covers.openlibrary.org/b/isbn/9780062803832-L.jpg'
    },
    {
        name: "Man's Search for Meaning",
        author: 'Viktor E. Frankl',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/080701429X',
        image: 'https://covers.openlibrary.org/b/isbn/9780807014271-L.jpg'
    },
    {
        name: 'The Power of Your Subconscious Mind',
        author: 'Joseph Murphy',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Power-Your-Subconscious-Mind/dp/0736968051',
        image: 'https://m.media-amazon.com/images/I/71sBtM3Yi5L._AC_UF1000,1000_QL80_.jpg'
    },
    {
        name: 'Dopamine Detox',
        author: 'Thibaut Meurisse',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Dopamine-Detox-Distractions-Train-Things/dp/B0988R8Q65',
        image: 'https://covers.openlibrary.org/b/isbn/9798525995178-L.jpg'
    },
    {
        name: 'Digital Minimalism',
        author: 'Cal Newport',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Digital-Minimalism-Choosing-Focused-Noisy/dp/0525536515',
        image: 'https://covers.openlibrary.org/b/isbn/9780525536512-L.jpg'
    },
    {
        name: 'The Laws of Human Nature',
        author: 'Robert Greene',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Laws-Human-Nature-Robert-Greene/dp/0525428143',
        image: 'https://covers.openlibrary.org/b/isbn/9780525428145-L.jpg'
    },
    {
        name: 'The Art of Seduction',
        author: 'Robert Greene',
        status: 'Wishlist',
        icon: <BookOpen className="size-4" />,
        href: 'https://www.amazon.com/Art-Seduction-Robert-Greene/dp/0142001198',
        image: 'https://covers.openlibrary.org/b/isbn/9780142001196-L.jpg'
    }
];
