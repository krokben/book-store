import { BookStore } from "../App";

const COUNTRY_FLAGS_API = "https://countryflagsapi.com";

export const BookStores = ({ bookStores }: { bookStores: BookStore[] }) => (
  <ul>
    {bookStores.map(
      ({
        id,
        name,
        establishmentDate,
        rating,
        website,
        image,
        country,
        books,
      }: BookStore) => (
        <li key={id}>
          <h2>{name}</h2>
          <ul>
            {[...Array(rating)].map(() => (
              <li>⭐</li>
            ))}
          </ul>
          <img src={image.url} alt={image.alt} />
          <table>
            <tr>
              <th>Best-selling books</th>
            </tr>
            {books.map(({ title, author }) => (
              <tr>
                <td>{title}</td>
                <td>{author}</td>
              </tr>
            ))}
          </table>
          <div>
            {establishmentDate} - {website}
          </div>
          <img src={`${COUNTRY_FLAGS_API}/svg/${country}`} />
        </li>
      )
    )}
  </ul>
);
