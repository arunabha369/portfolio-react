
import React from 'react';
import Link from '@/components/ui/Link';

const MovieCard = ({ movie }) => {
    return (
        <Link
            href={movie.href}
            target="_blank"
            className="group flex flex-col gap-3 p-0 no-underline"
        >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-zinc-700">
                {/* Movie Poster */}
                <img
                    src={movie.image}
                    alt={movie.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Badge (Overlay) */}
                <div className="absolute top-2 right-2">
                    <span className={`
                        px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm border border-white/10
                        ${movie.status === 'Watching' ? 'bg-yellow-500/80 text-black' : ''}
                        ${movie.status === 'Watched' ? 'bg-green-500/80 text-black' : ''}
                        ${movie.status === 'Wishlist' ? 'bg-blue-500/80 text-white' : ''}
                        ${movie.status === 'Favorite' ? 'bg-purple-500/80 text-white' : ''}
                    `}>
                        {movie.status}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-white leading-tight group-hover:text-accent transition-colors line-clamp-1" title={movie.name}>
                    {movie.name}
                </h3>
                <p className="text-sm text-zinc-500 line-clamp-1" title={movie.director}>
                    {movie.director}
                </p>
            </div>
        </Link>
    );
};

export default MovieCard;
