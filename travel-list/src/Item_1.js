export default function Item({item, onDeleteItem, onToggleItem}) {
    return (
      <li>
        <span style={item.packed ? {textDecoration: 'line-through'} : {}}>
          {item.quantity} {item.description}
        </span>
        <button onClick={() => onDeleteItem(item.id)}>❌</button>
        <input type="checkbox" value={item.packed} onChange={() => onToggleItem(item.id)}/>
      </li>
    )
  }
