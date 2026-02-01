
import React from 'react';
import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
import { movies } from '@/config/Movies';
import { Film } from 'lucide-react';
import { generateMetadata as getMetadata } from '@/config/Meta';
import MovieCard from '@/components/movies/MovieCard';
import { Helmet } from 'react-helmet-async';

export default function Movies() {
    return (
        <Container className="py-16">
            <Helmet>
                <title>Movies | Arunabha Banerjee</title>
            </Helmet>
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        Movies
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                        A curated list of films that have left a lasting impact on me.
                    </p>
                </div>
                <Separator />

                {/* Movies Grid Section */}
                <div className="space-y-6 pt-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-[#736F70] dark:border-white/10">
                            <Film className="size-4" />
                        </div>
                        <h2 className="text-2xl font-semibold">Favorite Movies</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {movies.map((movie) => (
                            <MovieCard key={movie.name} movie={movie} />
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
}
