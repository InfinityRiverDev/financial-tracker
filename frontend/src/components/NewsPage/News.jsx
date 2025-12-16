import { useEffect, useState } from "react";
import styles from "./News.module.css";

export default function News() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/news`
        );
        const data = await res.json();
        setArticles(data.articles || []);
      } catch {
        console.log("Not news");
      }
    };

    load();
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>News</h1>

      <div className={styles.list}>
        {articles.map((item, index) => (
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
