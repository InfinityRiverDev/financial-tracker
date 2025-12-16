import { useEffect, useState } from "react";
import styles from "./News.module.css";

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function loadNews() {
      try {
        var url = 'https://newsapi.org/v2/everything?' +
          'sources=bbc-news&' +
          'apiKey=ba0f9464fec245438dc4fed8f311339a';

        fetch(url)
          .then(response => response.json())
          .then(data => {
              setNews(data.articles); 
          })
          .catch(err => console.error(err));
      } catch (err) {
        console.error("Ошибка загрузки новостей:", err);
      }
    }

    loadNews();
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>News</h1>

      <div className={styles.list}>
        {news.map((item, index) => (
          <div className={styles.card} key={index}>
            {item.urlToImage && (
              <img className={styles.image} src={item.urlToImage} alt="" />
            )}

            <div className={styles.content}>
              <h3 className={styles.cardTitle}>{item.title}</h3>

              {item.description && (
                <p className={styles.desc}>{item.description}</p>
              )}

              <a
                className={styles.link}
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                Читать полностью →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
