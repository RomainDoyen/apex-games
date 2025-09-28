import '../../styles/components/Compteur.css';
import type { CompteurProps } from "../../types/types";

export default function Compteur({ title, value, valueMetrics, pastilleColor }: CompteurProps) {
    return (
        <div className="compteur-container">
            <div className="data">
              <div className="compteur-pastille" style={{ backgroundColor: pastilleColor }}></div>
                <div className="compteur-title">{title}</div>  
            </div>
            <div className="compteur-value">{value}{valueMetrics}</div>
        </div>
    )
}