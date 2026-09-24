import { ctaConfig } from '@/config/CTA';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CTA({
    profileImage = ctaConfig.profileImage,
    profileAlt = ctaConfig.profileAlt,
    linkText = ctaConfig.linkText,
    calLink = ctaConfig.calLink,
    preText = ctaConfig.preText,
    focusAreas = ctaConfig.focusAreas,
}) {
    const { triggerHaptic, isMobile } = useHapticFeedback();

    // State for multi-step flow
    const [showPreQualPopup, setShowPreQualPopup] = useState(false);
    const [showCalPopup, setShowCalPopup] = useState(false);

    // Form state
    const [role, setRole] = useState('');
    const [inquiry, setInquiry] = useState('');

    useEffect(() => {
        const cal = async () => {
            try {
                const calApi = await getCalApi();
                if (calApi) {
                    calApi('on', {
                        action: 'bookingSuccessful',
                        callback: () => {
                            setShowCalPopup(false);
                        },
                    });
                }
            } catch (error) {
                console.error('Failed to initialize Cal API:', error);
            }
        };
        cal();
    }, []);

    const handleButtonClick = () => {
        if (isMobile()) {
            triggerHaptic('medium');
        }
        // Step 1: Show Pre-qualification Modal
        setShowPreQualPopup(true);
    };

    const handleContinue = () => {
        // Step 2: Close Pre-qual and Show Cal Modal
        setShowPreQualPopup(false);
        setTimeout(() => setShowCalPopup(true), 150); // Slight delay for smooth transition
    };

    return (
        <>
            <Container className="mt-20 mb-20">
                <section aria-label="Areas of focus" className="rounded-lg border border-black/10 px-5 py-8 dark:border-white/10">
                    <div className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-md md:max-w-lg">
                        <div aria-hidden className="absolute top-0 left-1/2 h-[55%] w-[55%] -translate-x-1/2 rounded-full border border-foreground/10" />
                        <div aria-hidden className="absolute top-[22%] left-[2%] h-[55%] w-[55%] rounded-full border border-foreground/10" />
                        <div aria-hidden className="absolute top-[22%] right-[2%] h-[55%] w-[55%] rounded-full border border-foreground/10" />
                        <div aria-hidden className="absolute bottom-0 left-1/2 h-[55%] w-[55%] -translate-x-1/2 rounded-full border border-foreground/10" />

                        <span className="absolute top-[14%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[10px] whitespace-nowrap text-foreground/50 sm:text-xs md:text-sm">
                            {focusAreas.top}
                        </span>
                        <span className="absolute top-1/2 left-[15%] -translate-x-1/2 -translate-y-1/2 text-center text-[10px] whitespace-nowrap text-foreground/50 sm:text-xs md:text-sm">
                            {focusAreas.left}
                        </span>
                        <span className="absolute top-1/2 right-[15%] translate-x-1/2 -translate-y-1/2 text-center text-[10px] whitespace-nowrap text-foreground/50 sm:text-xs md:text-sm">
                            {focusAreas.right}
                        </span>
                        <span className="absolute bottom-[14%] left-1/2 -translate-x-1/2 translate-y-1/2 text-center text-[10px] leading-tight whitespace-pre text-foreground/50 sm:text-xs md:text-sm">
                            {focusAreas.bottom}
                        </span>

                        <div className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-background bg-neutral-800 shadow-md sm:size-16 sm:border-4 md:size-20">
                            <img src={profileImage} alt={profileAlt} className="size-full object-cover" />
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center px-5 pt-2 sm:px-10">
                        <p className="mb-5 text-center text-sm text-balance opacity-70 md:text-lg">
                            {preText}
                        </p>
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className="group inline-flex cursor-pointer items-center rounded-md border border-black/10 bg-black/[0.03] px-2 py-1 text-sm text-black shadow-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-white/15 dark:bg-white/15 dark:text-white dark:shadow-[0_0_5px_rgba(255,255,255,0.1)]"
                        >
                            <span className="relative z-20 flex items-center gap-2 transition-[gap] duration-300 group-hover:gap-8">
                                <span className="size-5 shrink-0 overflow-hidden rounded-full">
                                    <img alt="" width={20} height={20} className="size-full object-cover" src={profileImage} />
                                </span>
                                <span aria-hidden className="absolute left-6 flex -translate-x-full items-center opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                    <Plus className="size-3" />
                                    <span className="mr-2 ml-1 flex size-5 items-center justify-center rounded-full bg-black/10 text-[8px] dark:bg-white/10">
                                        You
                                    </span>
                                </span>
                                <span className="relative ml-0 block text-sm font-bold whitespace-nowrap transition-[margin-left] duration-300 group-hover:ml-4">
                                    {linkText}
                                </span>
                            </span>
                        </button>
                    </div>
                </section>
            </Container>

            {/* Step 1: Pre-qualification Dialog */}
            <Dialog open={showPreQualPopup} onOpenChange={setShowPreQualPopup}>
                <DialogContent className="sm:max-w-[425px] border-white/10 bg-black text-white p-6 shadow-2xl">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl font-semibold tracking-tight">Tell me about yourself</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-sm">
                            Please select your inquiry type to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-6 py-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-200">Are you a?</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-300 focus:ring-zinc-700 h-11">
                                    <SelectValue placeholder="Select an option..." />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                    <SelectItem value="Recruiter">Recruiter</SelectItem>
                                    <SelectItem value="Founder">Founder</SelectItem>
                                    <SelectItem value="Student">Student</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-200">What&apos;s your inquiry about?</Label>
                            <Select value={inquiry} onValueChange={setInquiry}>
                                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-300 focus:ring-zinc-700 h-11">
                                    <SelectValue placeholder="Select an option..." />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                    <SelectItem value="Hiring">Hiring</SelectItem>
                                    <SelectItem value="Project">Project Collaboration</SelectItem>
                                    <SelectItem value="Mentorship">Mentorship</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleContinue}
                            disabled={!role || !inquiry}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white h-11 font-medium transition-colors"
                        >
                            Continue
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Step 2: Cal.com Dialog */}
            <Dialog open={showCalPopup} onOpenChange={setShowCalPopup}>
                <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-5xl p-0 border-zinc-800 bg-zinc-950">
                    <DialogHeader className="p-6 pb-2 bg-zinc-950">
                        <DialogTitle className="text-white">Book a Meeting</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Schedule a time to connect and discuss opportunities
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[calc(90vh-100px)] overflow-y-auto bg-zinc-950">
                        <Cal
                            calLink={calLink}
                            config={{
                                name: 'Portfolio Visitor',
                                email: '',
                                notes: `Role: ${role}, Inquiry: ${inquiry} - Booked from portfolio website`,
                                theme: 'dark'
                            }}
                            className="w-full rounded-lg"
                            style={{ width: '100%', height: '100%', minHeight: '600px' }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
