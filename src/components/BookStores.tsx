import { BookStore, Book } from "../App";
import classnames from "classnames";

const COUNTRY_FLAGS_API = "https://flagcdn.com";

const getFormattedDate = (inputDate: string) => {
  let date = new Date(inputDate.toLocaleString());

  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
};

export const BookStores = ({
  bookStores,
  books,
  authors,
  countries,
  setBookStores,
}: {
  bookStores: BookStore[];
  books: Record<string, Book>;
  authors: Record<string, string>;
  countries: Record<string, string>;
  setBookStores: (bookStores: BookStore[]) => void;
}) => {
  const onStarClick = (id: string, rating: number) => {
    fetch(`http://localhost:3000/stores/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({ data: { attributes: { rating } } }),
    })
      .then(() =>
        setBookStores(
          bookStores.map((bookStore) =>
            bookStore.id === id ? { ...bookStore, rating } : bookStore
          )
        )
      )
      .catch(console.error);
  };

  return (
    <ul className="book-stores">
      {bookStores.map(
        ({
          id,
          name,
          establishmentDate,
          rating,
          website,
          image,
          countryId,
          bookIds,
        }: BookStore) => (
          <li className="book-store" key={id}>
            <img
              className="book-store__image"
              src={image.url}
              alt={image.alt}
            />
            <div className="book-store__text">
              <h2 className="book-store__name">{name}</h2>
              <ul className="book-store__rating" dir="rtl">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((score) => (
                  <li
                    className={classnames("book-store__star", {
                      "book-store__star--active": score <= rating,
                    })}
                    key={score}
                    onClick={() => onStarClick(id, score)}
                  ></li>
                ))}
              </ul>
              <table className="book-store__books">
                <thead>
                  <tr>
                    <th className="book-store__book-header">
                      Best-selling books
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookIds.length === 0 ? (
                    <tr>
                      <td className="book-store__book-info">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    bookIds
                      .filter((id) => books[id])
                      .map((id) => (
                        <tr key={`book-${id}`}>
                          <td className="book-store__book-info">
                            {books[id].title}
                          </td>
                          <td className="book-store__book-info">
                            {authors[books[id].authorId]}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="book-store__info">
              <span>
                {getFormattedDate(establishmentDate)} -{" "}
                <a href={website}>{website}</a>
              </span>
              <img
                className="book-store__flag"
                src={`${COUNTRY_FLAGS_API}/32x24/${countries[countryId]}.png`}
              />
            </div>
          </li>
        )
      )}
    </ul>
  );
};
