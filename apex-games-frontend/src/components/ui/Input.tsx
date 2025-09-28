import "../../styles/components/Input.css"
import type { InputProps } from "../../types/types";

export default function Input({
    type,
    name,
    placeholder,
    value,
    onChange,
    className = "",
    icon,
    ...props
}: InputProps) {
    return (
        <div className={`input-container ${className}`}>
            <input 
                type={type} 
                name={name}
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                className="input-field"
                {...props} 
            />
            {icon && <div className="input-icon">{icon}</div>}
        </div>
    )
}