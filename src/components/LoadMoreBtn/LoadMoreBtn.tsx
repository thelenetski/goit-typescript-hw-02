import css from "./LoadMoreBtn.module.css";

type Props = {
  onNext: () => void;
};

const LoadMoreBtn = ({ onNext }: Props) => {
  return (
    <div className={css.loadBtn}>
      <button type="button" onClick={onNext}>
        Load more
      </button>
    </div>
  );
};

export default LoadMoreBtn;
