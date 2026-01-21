import Link from '@/components/ui/Link';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <Container className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-muted-foreground mt-4 text-lg">
                The page you are looking for does not exist.
            </p>
            <div className="mt-8">
                <Button asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        </Container>
    );
}
