import { BookStore, Book } from "../App";

const COUNTRY_FLAGS_API = "https://flagcdn.com";

const getFormattedDate = (inputDate) => {
  let date = new Date(inputDate);

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
}: {
  bookStores: BookStore[];
  books: Record<string, Book>;
  authors: Record<string, string>;
  countries: Record<string, string>;
}) => (
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
          <img className="book-store__image" src={image.url} alt={image.alt} />
          <div className="book-store__text">
            <h2 className="book-store__name">{name}</h2>
            <ul className="book-store__rating">
              {[...Array(rating)].map((_, index) => (
                <li className="book-store__star" key={index}>
                  ⭐
                </li>
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
                {bookIds
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
                  ))}
              </tbody>
            </table>
          </div>
          <div className="book-store__info">
            <span>
              {getFormattedDate(establishmentDate)} - {website}
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
