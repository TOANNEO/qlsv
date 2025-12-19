import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="nav">
      <NavLink to="/" end>
        Trang chủ
      </NavLink>
      <NavLink to="/subjects">Môn học</NavLink>
    </nav>
  );
};

export default NavBar;
