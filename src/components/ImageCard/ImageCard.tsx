import { forwardRef, useRef, useEffect } from "react";
import css from "./ImageCard.module.css";
import { Image } from "../../App";
import { ModalTypes } from "../../App";

type Props = {
  imgData: Image;
  onModal: ({ url, alt, descr, author, likes }: ModalTypes) => void;
};

const ImageCard = forwardRef<HTMLImageElement, Props>(
  ({ imgData, onModal }, ref) => {
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      if (typeof ref === "function") {
        ref(imgRef.current); // для коллбэка
      } else if (ref) {
        ref.current = imgRef.current; // для объекта
      }
    }, [ref]);

    return (
      <div className={css.imgCard}>
        {imgData && (
          <img
            ref={imgRef}
            src={imgData.urls.small}
            alt={imgData.alt_description}
            onClick={() =>
              onModal({
                isOpen: true,
                url: imgData.urls.regular,
                alt: imgData.alt_description,
                descr: imgData.description,
                author: imgData.user.name,
                likes: imgData.likes,
              })
            }
          />
        )}
      </div>
    );
  }
);

export default ImageCard;
