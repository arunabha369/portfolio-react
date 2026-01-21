
import React from 'react';
import Link from '@/components/ui/Link';

const BookCard = ({ book }) => {
    return (
        <Link
            href={book.href}
            target="_blank"
            className="group flex flex-col gap-3 p-0 no-underline"
        >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-zinc-700">
                {/* Book Cover */}
                <img
                    src={book.image}
                    alt={book.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Badge (Overlay) */}
                <div className="absolute top-2 right-2">
                    <span className={`
                        px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm border border-white/10
                        ${book.status === 'Reading' ? 'bg-yellow-500/80 text-black' : ''}
                        ${book.status === 'Completed' ? 'bg-green-500/80 text-black' : ''}
                        ${book.status === 'Wishlist' ? 'bg-blue-500/80 text-white' : ''}
                    `}>
                        {book.status}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-white leading-tight group-hover:text-accent transition-colors line-clamp-1" title={book.name}>
                    {book.name}
                </h3>
                <p className="text-sm text-zinc-500 line-clamp-1" title={book.author}>
                    {book.author}
                </p>
            </div>
        </Link>
    );
};

export default BookCard;
