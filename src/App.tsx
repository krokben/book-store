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
      return response.json();
    };

    Promise.all([
      fetchData("stores"),
      fetchData("books"),
      fetchData("authors"),
      fetchData("countries"),
    ])
      .then(([storeData, bookData, authorData, countryData]) => {
        setBookStores(
          storeData.data.map(({ id, attributes, relationships }) => ({
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
        );
        setBooks(
          bookData.data.reduce(
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
        );
        setAuthors(
          authorData.data.reduce(
            (acc, { id, attributes }) => ({
              ...acc,
              [id]: attributes.fullName,
            }),
            {}
          )
        );
        setCountries(
          countryData.data.reduce(
            (acc, { id, attributes }) => ({
              ...acc,
              [id]: attributes.code.toLowerCase(),
            }),
            {}
          )
        );
        setStatus("SUCCESS");
      })
      .catch((error) => {
        console.error(error);
        setStatus("ERROR");
      });
  }, []);

  return (
    <>
      {status === "SUCCESS" ? (
        <BookStores
          bookStores={bookStores}
          books={books}
          authors={authors}
          countries={countries}
          setBookStores={setBookStores}
        />
      ) : (
        <div>{getStatusMessage(status)}</div>
      )}
    </>
  );
}
