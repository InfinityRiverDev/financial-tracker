import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
  useImportTransactionsMutation
} from "../../store/api";

import styles from "./Overview.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useEffect, useState } from "react";

export default function Overview() {
  //Переменные для export-а транзакций
  const { data: transactions = [] } = useGetTransactionsQuery();
  const [deleteTransaction] = useDeleteTransactionMutation();

  //Переменная для import-а транзакций
  const [importTransactions] = useImportTransactionsMutation();

  //Переменные для фильтрации
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  //Переменные для работы с конвертацией
  const [namesValute, setNamesValute] = useState([]);
  const [valutes, setValutes] = useState({});
  const [currencyModal, setCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("RUB"); 
  const [rate, setRate] = useState(1); 

  //Переменная для анимации
  const [deletingId, setDeletingId] = useState(null);

  //Выгрузка api для конвертации валют ---------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const url =
          "https://v6.exchangerate-api.com/v6/69d4146ab57a9ec95a623c28/latest/RUB";

        const response = await fetch(url);
        const data = await response.json();

        const names = Object.keys(data.conversion_rates);

        setValutes(data.conversion_rates);
        setNamesValute(names);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      }
    };

    load();
  }, []);

  const convertCurrency = () => {
    if (!selectedCurrency) return;

    const newRate = valutes[selectedCurrency];

    if (!newRate) return;

    setRate(newRate); 
    setCurrencyModal(false);
  };

//-------------------------------------------

/*
[
  {
    _id: "...",
    amount: 1000,
    type: "expense",
    category: "Еда",
    date: "2024-12-01",
    convertedAmount: 12.34
  },
  ...
]
 */

  const filtered = transactions.map((t) => {
    const convertedAmount =
      selectedCurrency === "RUB"
        ? t.amount
        : (t.amount * rate).toFixed(2);

    return { ...t, convertedAmount };
  }).filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;

    const tDate = new Date(t.date);
    const today = new Date();

    if (dateFilter === "day") {
      return tDate.toDateString() === today.toDateString();
    }

    if (dateFilter === "week") {
      const diff = (today - tDate) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }

    if (dateFilter === "month") {
      return (
        tDate.getMonth() === today.getMonth() &&
        tDate.getFullYear() === today.getFullYear()
      );
    }

    return true;
  });
//------------------------------------------------------

  //Графики
  const balanceData = transactions.map((t, i) => {
    const originalBalance = transactions
      .slice(0, i + 1)
      .reduce(
        (sum, x) => sum + (x.type === "income" ? x.amount : -x.amount),
        0
      );

    const convertedBalance =
      selectedCurrency === "RUB"
        ? originalBalance
        : (originalBalance * rate).toFixed(2);

    return {
      date: t.date,
      balance: Number(convertedBalance),
    };
  });

  const expenses = filtered.filter((t) => t.type === "expense");

  const categories = {};
  expenses.forEach((e) => {
    categories[e.category] =
      (categories[e.category] || 0) + Number(e.convertedAmount);
  });

  const pieData = Object.keys(categories).map((k) => ({
    name: k,
    value: categories[k],
  }));

  const pieColors = ["#60a5fa", "#7dd3fc", "#fb7185", "#a78bfa", "#34d399"];
//---------------------------------------------------------

  //Анимация и удаление таска -----------------------------------
  const deleteHandler = async (id) => {
    setDeletingId(id); 

    setTimeout(async () => {
      await deleteTransaction(id);
      setDeletingId(null);
    }, 300); 
  };
//----------------------------------------------------

  //Export
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "transactions.json";
    a.click();
  };
//-------------------------------------------------

  //Import 
  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        await importTransactions(data);
        alert("Импорт успешно выполнен");
      } catch (err) {
        alert("Ошибка импорта");
        console.error(err.name);
      }
    };

    reader.readAsText(file);
  };
//---------------------------------------------

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Overview</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Баланс ({selectedCurrency})</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={balanceData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#60a5fa"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            Расходы по категориям ({selectedCurrency})
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.filters}>
        <select onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">Вся история</option>
          <option value="day">Сегодня</option>
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
        </select>

        <select onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Все категории</option>
          <option value="Еда">Еда</option>
          <option value="Транспорт">Транспорт</option>
          <option value="Развлечения">Развлечения</option>
          <option value="Покупки">Покупки</option>
          <option value="Доход">Доход</option>
        </select>

        <select onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">Тип</option>
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>

        <button className={styles.downloadBtn} onClick={downloadJSON}>
          Скачать JSON
        </button>
        <label className={styles.downloadBtn}>
          Импортировать JSON
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={importJSON}
          />
        </label>

        <button
          className={styles.currencyBtn}
          onClick={() => setCurrencyModal(true)}
        >
          Конвертировать валюту
        </button>
      </div>

      {currencyModal && (
        <div className={styles.modalBg}>
          <div className={styles.modal}>
            <h3>Выберите валюту</h3>

            <select
              className={styles.currencySelect}
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="">Выберите...</option>
              {namesValute.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setCurrencyModal(false)}
              >
                Отмена
              </button>

              <button className={styles.applyBtn} onClick={convertCurrency}>
                Применить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Категория</th>
              <th>Тип</th>
              <th>Сумма ({selectedCurrency})</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t._id} className={deletingId === t._id ? styles.fadeOut : ""}>
                <td>{t.date}</td>
                <td>{t.category}</td>
                <td
                  className={
                    t.type === "income" ? styles.income : styles.expense
                  }
                >
                  {t.type}
                </td>

                <td>
                  {t.convertedAmount} {selectedCurrency}
                </td>

                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteHandler(t._id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
