import css from "./SearchBar.module.css";
import { FaSearch } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { FormEvent } from "react";

interface ImgDataTypes {
  total: number;
  total_pages: number;
  results: [];
}

type Props = {
  onSubmit: (querry: string) => void;
  data: ImgDataTypes | null;
};

const SearchBar = ({ onSubmit, data }: Props) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem("search") as HTMLInputElement;
    if (
      searchInput.value.trim() === "" ||
      /^\s*$/.test(searchInput.value.trim())
    ) {
      return toast.error("Empty request, please write some text.");
    }
    onSubmit(searchInput.value.trim());
    form.reset();
  };

  return (
    <header className={css.search}>
      <div>
        <Toaster position="top-left" reverseOrder={true} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>
      {data && data.total_pages > 0 && (
        <div className={css.info}>
          <p>{`Images: ${data.total}`}</p>
          <p>{`Pages: ${data.total_pages}`}</p>
        </div>
      )}
    </header>
  );
};

export default SearchBar;
