import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
const { getData } = require("./db/db");
const foods = getData();

const tele = window.Telegram.WebApp;

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    tele.ready();
  }, []); // hanya sekali saat komponen mount

  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  const onCheckout = () => {
    if (cartItems.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    tele.MainButton.text = `Bayar Rp${totalAmount.toLocaleString("id-ID")}`;
    tele.MainButton.show();

    // Hindari multiple listener
    tele.MainButton.onClick(() => handlePayment(totalAmount));
  };

  const handlePayment = async (totalAmount) => {
    try {
      const res = await fetch("http://localhost:3001/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          name: tele.initDataUnsafe?.user?.first_name || "Guest",
          email: "guest@example.com",
        }),
      });

      const data = await res.json();
      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: function (result) {
            alert("Pembayaran berhasil!");
            tele.sendData("paid");
            tele.close();
          },
          onPending: function (result) {
            alert("Menunggu pembayaran.");
          },
          onError: function (result) {
            alert("Pembayaran gagal.");
          },
          onClose: function () {
            alert("Kamu menutup halaman pembayaran.");
          },
        });
      } else {
        alert("Token tidak tersedia.");
      }
    } catch (err) {
      alert("Gagal membuat transaksi");
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="heading">Silahkan Pilih!</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards__container">
        {foods.map((food) => (
          <Card
            food={food}
            key={food.id}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </>
  );
}

export default App;
