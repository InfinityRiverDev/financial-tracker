import React, { useState } from "react";
import styles from "./Transaction.module.css";
import { useAddTransactionMutation } from "../../store/api";

const expenseTargets = ["Еда", "Транспорт", "Развлечения", "Покупки", "Другое"];

export default function Transaction() {
  const [type, setType] = useState("income");
  const [expenseTarget, setExpenseTarget] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");

  const [addTransaction] = useAddTransactionMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    const newTransaction = {
      type,
      category: type === "expense" ? expenseTarget : "Доход",
      amount: Number(amount),
      comment,
      date,
    };

    await addTransaction(newTransaction);

    setType("income");
    setExpenseTarget("");
    setAmount("");
    setComment("");
    setDate("");
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Create a transaction</h2>

      <form className={styles.form} onSubmit={submitHandler}>
        
        <div className={styles.group}>
          <label>Тип:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
        </div>


        {type === "expense" && (
          <div className={styles.group}>
            <label>На что потрачено:</label>
            <select
              value={expenseTarget}
              onChange={(e) => setExpenseTarget(e.target.value)}
              required
            >
              <option value="">Выберите категорию</option>
              {expenseTargets.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.group}>
          <label>Сумма:</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className={styles.group}>
          <label>Комментарий:</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Описание"
          />
        </div>

        <div className={styles.group}>
          <label>Дата:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button className={styles.btn} type="submit">
          Создать
        </button>
      </form>
    </div>
  );
}
