import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import SearchBar from "./components/SearchBar/SearchBar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import Loader from "./components/Loader/Loader";
import ImageModal from "./components/ImageModal/ImageModal";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import { AiOutlinePicture } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

interface ImgDataTypes {
  total: number;
  total_pages: number;
  results: [];
}

type ModalTypes = {
  isOpen: boolean;
  url: string;
  alt: string;
  descr: string;
  author: string;
  likes: number;
};

function App() {
  const [search, setSearch] = useState<string>("");
  const [imgData, setImgData] = useState<ImgDataTypes | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMoreBtnState, setLoadMoreBtnState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState<ModalTypes>({
    isOpen: false,
    url: "",
    alt: "",
    descr: "",
    author: "",
    likes: 0,
  });
  const galleryRef = useRef<HTMLImageElement>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const PERPAGE: string = "15";

  const searchParams = new URLSearchParams({
    query: search,
    per_page: PERPAGE,
    page: currentPage.toString(),
  });

  useEffect(() => {
    if (search === "") {
      return;
    }
    try {
      const dataRequest = async (): Promise<ImgDataTypes> => {
        setLoading(true);
        setErrorMsg("");
        const response = await axios.get<ImgDataTypes>(
          `https://api.unsplash.com/search/photos?${searchParams}`,
          {
            headers: {
              Authorization: `Client-ID bF_HerDN5h7a7WozJpD-AEWD08N_mhzLLSreF6YpFxA`,
            },
          }
        );
        return response.data;
      };

      dataRequest()
        .then((data: ImgDataTypes): void => {
          setImgData((prev): ImgDataTypes => {
            return {
              total: data.total,
              total_pages: data.total_pages,
              results: [...(prev?.results ?? []), ...data.results],
            };
          });

          if (data.total === 0)
            setErrorMsg("Nothing was found for your request");

          checkPages(data.total_pages);
          setLoading(false);
        })
        .catch((error): void => {
          setLoading(false);
          setErrorMsg(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, [search, currentPage]);

  useEffect(() => {
    if (currentPage > 1) scrollWindow();
  }, [imgData, currentPage]);

  const handleSearch = (searchRequest: string): string | void => {
    if (searchRequest === search) {
      return toast.error("This request already done, try another one");
    }
    setCurrentPage(1);
    setLoadMoreBtnState(false);
    setImgData({
      total: imgData?.total ?? 0,
      total_pages: imgData?.total_pages ?? 0,
      results: [],
    });
    setSearch(searchRequest);
  };

  const handleLoadMore = (): void => {
    setCurrentPage(currentPage + 1);
  };

  const checkPages = (dataPages: number): void => {
    if (dataPages > 1) {
      setLoadMoreBtnState(true);
    }

    if (currentPage >= dataPages) {
      setLoadMoreBtnState(false);
    }
  };

  const handleOpenModal = ({
    isOpen,
    url,
    alt,
    descr,
    author,
    likes,
  }: ModalTypes): void => {
    setIsOpen({
      isOpen,
      url,
      alt,
      descr,
      author,
      likes,
    });
  };

  const handleCloseModal = (): void => {
    setIsOpen({ ...modalIsOpen, isOpen: false });
  };

  const scrollWindow = (): void => {
    if (galleryRef.current)
      window.scrollBy({
        top: galleryRef.current.height * 3,
        behavior: "smooth",
      });
  };

  // console.log(imgData);

  return (
    <>
      <SearchBar onSubmit={handleSearch} data={imgData} />
      <div style={{ width: "100%", height: "120px" }}></div>
      <Toaster position="top-left" reverseOrder={true} />
      {imgData?.total && !(imgData.total > 0) && (
        <AiOutlinePicture className="bgIcon" />
      )}
      {imgData?.total && imgData.total > 0 && (
        <ImageGallery
          lastImageRef={galleryRef}
          data={imgData}
          onModal={handleOpenModal}
        />
      )}
      {!loading && <ErrorMessage text={errorMsg} />}
      <ImageModal data={modalIsOpen} closeModal={handleCloseModal} />
      <Loader loading={loading} />
      {loadMoreBtnState && <LoadMoreBtn onNext={handleLoadMore} />}
    </>
  );
}

export default App;
