import ImageCard from "../ImageCard/ImageCard";
import css from "./ImageGallery.module.css";
import { RefObject } from "react";

interface ImgDataTypes {
  total: number;
  total_pages: number;
  results:
    | []
    | [
        {
          id: string;
          urls: {
            regular: string;
            small: string;
          };
          alt_description: string;
          description: string;
          user: {
            name: string;
          };
          likes: number;
        }
      ];
}

type ModalTypes = {
  isOpen: boolean;
  url: string;
  alt: string;
  descr: string;
  author: string;
  likes: number;
};

type Props = {
  data: ImgDataTypes | null;
  onModal: ({ url, alt, descr, author, likes }: ModalTypes) => void;
  lastImageRef: RefObject<HTMLImageElement>;
};

const ImageGallery = ({ data, onModal, lastImageRef }: Props) => {
  return (
    <div className={css.imgGallery}>
      {data && (
        <ul>
          {data.results.map((item, index) => {
            return (
              <li key={item.id}>
                <ImageCard
                  ref={index === data.results.length - 1 ? lastImageRef : null}
                  imgData={item}
                  onModal={onModal}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ImageGallery;
