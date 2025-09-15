import "../../styles/components/Card.css"
import Image from "./Image"
import type { CardProps } from "../../types/types";

export default function Card({ title, image }: CardProps) {
    return (
        <div className="card"draggable>
            <div className="card-image">
                <Image src={image} alt={title} className="card-image" />
            </div>
            <div className="card-content">
                <h3>{title}</h3>
            </div>
        </div>
    )
}