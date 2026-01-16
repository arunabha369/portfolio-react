import { ctaConfig } from '@/config/CTA';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import Cal, { getCalApi } from '@calcom/embed-react';
import Image from '@/components/ui/Image';
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
            <Container className="mt-20 rounded-md border border-dashed border-black/20 py-8 dark:border-white/10 mb-20">
                <div className="mt-6 w-full flex flex-col items-center justify-center px-6 pb-8 text-center sm:px-12">
                    <p className="mb-4 text-center text-base opacity-50 sm:mb-6 md:text-xl">
                        {preText}
                    </p>
                    <div className="flex w-full justify-center">
                        <div
                            className="group inline-flex cursor-pointer items-center self-end rounded-md border border-dashed border-black/20 bg-black/5 px-2 py-1 text-sm text-black shadow-[0_0_5px_rgba(0,0,0,0.1)] transition-all dark:border-white/30 dark:bg-white/15 dark:text-white dark:shadow-[0_0_5px_rgba(255,255,255,0.1)]"
                            onClick={handleButtonClick}
                        >
                            <div className="relative z-20 flex items-center transition-all duration-300">
                                <div className="h-5 w-5 flex-shrink-0 overflow-hidden rounded-full mr-2 transition-all duration-300 group-hover:mr-1">
                                    <Image
                                        alt={profileAlt}
                                        width={20}
                                        height={20}
                                        className="h-full w-full object-cover"
                                        src={profileImage}
                                        style={{ color: 'transparent' }}
                                    />
                                </div>
                                <div className="group-hover:max-w-[100px] max-w-0 flex items-center overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100">
                                    <div className="flex items-center min-w-max pr-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-3 w-3"
                                        >
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5v14"></path>
                                        </svg>
                                        <div className="mr-0 ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[8px] dark:bg-white/10">
                                            You
                                        </div>
                                    </div>
                                </div>
                                <span className="relative block text-sm font-bold whitespace-nowrap transition-all duration-300">
                                    {linkText}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
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
