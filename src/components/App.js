import React, { useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import mockItems from "../mock.json";

export default function App() {
  const [order, setOrder] = useState("createdAt");
  const [items, setItems] = useState(mockItems);

  useEffect(() => {
    setItems((prev) => [...prev.sort((a, b) => b[order] - a[order])]);
  }, [order]);

  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  return (
    <div>
      <div>
        <button onClick={() => setOrder("createdAt")}>최신순</button>
        <button onClick={() => setOrder("rating")}>평점순</button>
      </div>
      <ReviewList items={items} onDelete={handleDelete} />
    </div>
  );
}
