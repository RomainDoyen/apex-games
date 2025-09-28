import "../../styles/components/Button.css"

import type { ButtonProps } from "../../types/types";

export default function Button({ text, color, backgroundColor, link }: ButtonProps) {
    return (
        <button className="button" style={{ color, backgroundColor }} onClick={() => window.location.href = link || ""}>
            {text}
        </button>
    )
}