import { useEffect, useState } from "react";
import { BookStores } from "./components/BookStores";

type Status = "IDLE" | "FETCHING" | "SUCCESS" | "ERROR";

type Image = {
  url: string;
  alt: string;
};

export type Book = {
  title: string;
  copiesSold: number;
  authorId: string;
};

export interface BookStore {
  id: string;
  name: string;
  website: string;
  establishmentDate: string;
  countryId: string;
  rating: number;
  image: Image;
  bookIds: string[];
}

const dummyBookStore = {
  id: "1",
  name: "Book Store",
  website: "www.bookstore.com",
  establishmentDate: "1995-02-09T00:00:00+0000",
  country: "CH",
  rating: 4,
  image: { url: "https://via.placeholder.com/100", alt: "Book Store Image" },
  bookIds: ["1", "2"],
};

const getStatusMessage = (status: Status) => {
  switch (status) {
    case "ERROR":
      return "No data available";
    case "FETCHING":
      return "Fetching data…";
    case "IDLE":
      return "";
    default:
      return "";
  }
};

export function App() {
  const [status, setStatus] = useState<Status>("IDLE");
  const [bookStores, setBookStores] = useState<BookStore[]>([]);
  const [books, setBooks] = useState<Record<string, Book>>({});
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [countries, setCountries] = useState<Record<string, string>>({});

  useEffect(() => {
    setStatus("FETCHING");

    const fetchData = async (
      type: "stores" | "books" | "authors" | "countries"
    ) => {
      const response = await fetch(`http://localhost:3000/${type}`);
      const { data } = await response.json();
      return data;
    };

    fetchData("stores")
      .then((data) =>
        setBookStores(
          data.map(({ id, attributes, relationships }) => ({
            id,
            name: attributes.name,
            website: attributes.website,
            establishmentDate: attributes.establishmentDate,
            countryId: relationships.countries.data.id,
            rating: attributes.rating,
            image: { url: attributes.storeImage, alt: "Book Store Image" },
            bookIds: relationships.books
              ? relationships.books.data.map((book: { id: string }) => book.id)
              : [],
          }))
        )
      )
      .catch((error) => {
        console.error(error);
        setStatus("ERROR");
      });

    fetchData("books")
      .then((data) =>
        setBooks(
          data.reduce(
            (acc, { id, attributes, relationships }) => ({
              ...acc,
              [id]: {
                title: attributes.name,
                copiesSold: attributes.copiesSold,
                authorId: relationships.author.data.id,
              },
            }),
            {}
          )
        )
      )
      .catch((error) => {
        console.error(error);
        setStatus("ERROR");
      });

    fetchData("authors")
      .then((data) =>
        setAuthors(
          data.reduce(
            (acc, { id, attributes }) => ({
              ...acc,
              [id]: attributes.fullName,
            }),
            {}
          )
        )
      )
      .catch((error) => {
        console.error(error);
        setStatus("ERROR");
      });

    fetchData("countries").then((data) =>
      setCountries(
        data.reduce(
          (acc, { id, attributes }) => ({
            ...acc,
            [id]: attributes.code.toLowerCase(),
          }),
          {}
        )
      )
    );

    if (status === "ERROR") {
      return;
    }

    setStatus("SUCCESS");
  }, []);

  return (
    <>
      {status === "SUCCESS" ? (
        <BookStores
          bookStores={bookStores}
          books={books}
          authors={authors}
          countries={countries}
        />
      ) : (
        <div>{getStatusMessage(status)}</div>
      )}
    </>
  );
}
