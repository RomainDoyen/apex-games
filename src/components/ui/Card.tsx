import "../../styles/components/Card.css"
import Image from "./Image"
import BookmarkButton from "./BookmarkButton"
import type { CardProps } from "../../types/types";

export default function Card({ title, image, game }: CardProps) {
    return (
        <div className="card">
            <div className="card-image">
                <Image src={image} alt={title} className="card-image" />
                {game && <BookmarkButton game={game} size="medium" />}
            </div>
            <div className="card-content">
                <h3>{title}</h3>
            </div>
        </div>
    )
}