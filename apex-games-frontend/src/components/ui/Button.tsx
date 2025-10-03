import "../../styles/components/Button.css"

import type { ButtonProps } from "../../types/types";

export default function Button({ text, color, backgroundColor, link, disabled = false }: ButtonProps) {
    if (link && !disabled) {
        return (
            <button className="button" style={{ color, backgroundColor }} onClick={() => window.location.href = link}>
                {text}
            </button>
        )
    }

    return (
        <button 
            className="button" 
            style={{ color, backgroundColor }} 
            disabled={disabled}
            type="submit"
        >
            {text}
        </button>
    )
}