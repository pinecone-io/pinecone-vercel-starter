import React, { FormEvent } from 'react';

interface ChatInputProps {
    input: string;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleMessageSubmit: (event: FormEvent<HTMLFormElement>) => void;
    showIndexMessage: boolean;
}

const styles = {
    container: { border: "1px solid #738FAB1F", padding: 30 },
    form: { border: "1px solid #738FAB80", borderRadius: 4 },
    svg: { background: "black", margin: 9, borderRadius: 4 },
    message: { marginTop: 15, color: "#72788D", fontSize: 12 },
    hint: { position: "absolute", top: 10, right: 35, fontSize: 12, color: "#72788D" }
};

const ChatInput: React.FC<ChatInputProps> = ({ input, handleInputChange, handleMessageSubmit, showIndexMessage }) => {
    return (
        <div style={styles.container} className="w-full">
            <form
                onSubmit={handleMessageSubmit}
                className="bg-white rounded-lg relative"
            >
                <div style={styles.form}>
                    <input
                        type="text"
                        className="input-glow appearance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline pl-3 pr-10 transition-shadow duration-200"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Start typing..."
                        maxLength={105}
                    />
                    <div style={{ ...styles.hint, position: "absolute" as "absolute", visibility: `${input.length > 0 ? "visible" : "hidden"}` }}>Hit enter to send</div>
                    <svg style={styles.svg} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="black" className="absolute right-0 top-0 mt-3 mr-3">
                        <path d="M3.33301 9.99998L4.50801 11.175L9.16634 6.52498V16.6666H10.833V6.52498L15.483 11.1833L16.6663 9.99998L9.99967 3.33331L3.33301 9.99998Z" fill="white" />
                    </svg>
                </div>

                {showIndexMessage && <div style={styles.message}>
                    Your index contains no vector embeddings yet. Please add some by indexing one of the demo URLs on the left.
                </div>}

            </form>
        </div>
    );
};

export default ChatInput;
