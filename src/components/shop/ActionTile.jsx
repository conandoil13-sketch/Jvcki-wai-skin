import { Link } from "react-router-dom";

function ActionTile({ to, icon: Icon, title, text }) {
  return (
    <Link to={to} className="action-tile">
      <Icon size={24} />
      <span>{title}</span>
      <small>{text}</small>
    </Link>
  );
}

export default ActionTile;
