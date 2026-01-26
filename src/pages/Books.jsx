import React from 'react';
import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
import { books } from '@/config/Books';
import { Book } from 'lucide-react';
import { generateMetadata as getMetadata } from '@/config/Meta';
import BookCard from '@/components/books/BookCard';
import { Helmet } from 'react-helmet-async';

export const metadata = {
    ...getMetadata('/books'),
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    }
};

export default function Books() {
    return (
        <Container className="py-16">
            <Helmet>
                <title>Books | Arunabha Banerjee</title>
            </Helmet>
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        Books
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                        A collection of books that have influenced my thinking and growth.
                    </p>
                </div>
                <Separator />

                {/* Books Grid Section */}
                <div className="space-y-6 pt-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-[#736F70] dark:border-white/10">
                            <Book className="size-4" />
                        </div>
                        <h2 className="text-2xl font-semibold">Reading List</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {books.map((book) => (
                            <BookCard key={book.name} book={book} />
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
}
