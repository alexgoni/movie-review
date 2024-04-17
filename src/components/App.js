import React, { useCallback, useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import { createReview, getReviews, updateReview, deleteReview } from "../api";
import ReviewForm from "./ReviewForm";
import useAsync from "../hooks/useAsync";

const LIMIT = 6;

export default function App() {
  const [order, setOrder] = useState("createdAt");
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, loadingError, getReviewsAsync] = useAsync(getReviews);
  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleDelete = async (id) => {
    const result = await deleteReview(id);
    if (!result) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLoad = useCallback(
    async (options) => {
      const result = await getReviewsAsync(options);
      if (!result) return;

      const { reviews, paging } = result;
      if (options.offset === 0) {
        setItems(reviews);
      } else {
        setItems((prev) => [...prev, ...reviews]);
      }
      setOffset(reviews.length + options.offset);
      setHasNext(paging.hasNext);
    },
    [getReviewsAsync]
  );

  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  const handleCreateSuccess = (review) => {
    setItems((prev) => [review, ...prev]);
  };

  const handleUpdateSuccess = (review) => {
    setItems((prev) => {
      const splitIdx = prev.findIndex((item) => item.id === review.id);
      const newItems = [...prev];
      newItems.splice(splitIdx, 1, review);
      return newItems;
    });
  };

  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order, handleLoad]);

  return (
    <div>
      <div>
        <button onClick={() => setOrder("createdAt")}>최신순</button>
        <button onClick={() => setOrder("rating")}>평점순</button>
      </div>
      <ReviewForm
        onSubmit={createReview}
        onSubmitSuccess={handleCreateSuccess}
      />
      <ReviewList
        items={sortedItems}
        onDelete={handleDelete}
        onUpdate={updateReview}
        onUpdateSuccess={handleUpdateSuccess}
      />
      {hasNext && (
        <button disabled={isLoading} onClick={handleLoadMore}>
          더 보기
        </button>
      )}
      {loadingError?.messages && <span>{loadingError?.messages}</span>}
    </div>
  );
}
