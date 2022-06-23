import { useState } from "react";
import { BookStores } from "./components/BookStores";

type Image = {
  url: string;
  alt: string;
};

type Book = {
  id: string;
  title: string;
  author: string;
};

export interface BookStore {
  id: string;
  name: string;
  website: string;
  establishmentDate: string;
  country: string;
  rating: number;
  image: Image;
  books: Book[];
}

const dummyBookStore = {
  id: "1",
  name: "Book Store",
  website: "www.bookstore.com",
  establishmentDate: "1995-02-09T00:00:00+0000",
  country: "CH",
  rating: 4,
  image: { url: "https://via.placeholder.com/100", alt: "Book Store Image" },
  books: [
    { id: "1", title: "Book 1", author: "Author 1" },
    { id: "2", title: "Book 2", author: "Author 2" },
  ],
};

export function App() {
  const [bookStores, setBookStores] = useState<BookStore[]>([dummyBookStore]);

  return (
    <>
      <BookStores bookStores={bookStores} />
    </>
  );
}
