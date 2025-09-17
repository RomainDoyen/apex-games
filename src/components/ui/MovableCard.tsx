import "../../styles/components/MovableCard.css"
import Image from "./Image"
import type { MovableCardProps } from "../../types/types";

export default function MovableCard({id, title, image }: MovableCardProps) {
    return (
        <div className="movableCard"draggable onDragStart={(e)=>{
            e.dataTransfer.setData('gameId',id.toString());
        }}>
            <div className="movableCard-image">
                <Image src={image} alt={title} className="movableCard-image" />
            </div>
            <div className="movableCard-content">
                <h3>{title}</h3>
            </div>
        </div>
    )
}