import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

// function App() {
//   return <EatNSplit />;
// }

function App() {
  const [friends, setFriend] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriend((friends) => [...friends, friend]);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        <FormAddFriend onAddFriend={handleAddFriend} />
      </div>
      {selectedFriend ? (
        <BillSplitForm
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}{" "}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe You {friend.balance}{" "}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend?.name} are even </p>}
      <button className="button" onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "Open"}
      </button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label> Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button className="button">Add</button>
    </form>
  );
}

function BillSplitForm({ selectedFriend, onSplitBill }) {
  const [totalBill, setTotalBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [whoIspaying, setWhoIsPaying] = useState("user");

  const friendExpense =
    totalBill >= userExpense ? (totalBill ? totalBill - userExpense : "") : "";

  function handleSubmit(e) {
    e.preventDefault();
    if (!totalBill || !userExpense) return;
    onSplitBill(whoIspaying === "user" ? friendExpense : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>
        Split a bill with{" "}
        {selectedFriend?.name ? selectedFriend?.name : "friend"}
      </h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={totalBill}
        onChange={(e) => setTotalBill(Number(e.target.value))}
      />
      <label>Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            totalBill <= userExpense ? userExpense : Number(e.target.value)
          )
        }
      />
      <label>
        {selectedFriend?.name ? selectedFriend?.name : "friend"}'s expense
      </label>
      <input type="text" disabled value={friendExpense} />
      <label>Who is paying the bill</label>
      <select
        value={whoIspaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">
          {selectedFriend?.name ? selectedFriend?.name : "friend"}
        </option>
      </select>

      <button className="button">Split bill</button>
    </form>
  );
}
export default App;
