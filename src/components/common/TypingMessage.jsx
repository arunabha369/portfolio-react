import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const TypingMessage = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(interval);
                if (onComplete) {
                    onComplete();
                }
            }
        }, 15); // Adjust typing speed here (lower is faster)

        return () => clearInterval(interval);
    }, [text]); // Re-run if text changes (though it shouldn't for a single message)

    return (
        <ReactMarkdown
            components={{
                a: (props) => (
                    <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words text-blue-500 underline hover:text-blue-700"
                    />
                ),
                p: (props) => <p {...props} className="m-0 leading-relaxed" />,
                ul: (props) => <ul {...props} className="m-0 pl-4" />,
                ol: (props) => <ol {...props} className="m-0 pl-4" />,
                li: (props) => <li {...props} className="m-0" />,
                strong: (props) => <strong {...props} className="font-semibold" />,
            }}
        >
            {displayedText}
        </ReactMarkdown>
    );
};

export default TypingMessage;
