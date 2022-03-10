import clsx from "clsx";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

// import "./Header.css";

type HeaderProps = { collapsed: boolean; onCollapsed: () => void };

export default function Header({ collapsed, onCollapsed }: HeaderProps) {
  return (
    <div className="w-full h-[88px] sticky top-0 flex justify-around items-center bg-[#5d4954] z-50">
      <h3 className="text-xl font-semibold text-white tracking-widest">
        ViaLand
      </h3>
      <AiOutlineMenu
        className="cursor-pointer block md:hidden"
        color="#fff"
        size={30}
        onClick={onCollapsed}
      />
      <ul
        className={clsx(
          "nav md:nav-md lg:w-[40%] text-white text-base whitespace-nowrap bg-[#5d4954] z-50",
          collapsed && "nav--active"
        )}
      >
        <li>
          <Link to="/">Trang Chủ</Link>
        </li>
        <li>
          <Link to="/">Nhà Đất</Link>
        </li>

        <li>
          <Link to="/">Cho Thuê</Link>
        </li>
        <li>
          <Link to="/">Đăng tin miễn phí</Link>
        </li>
      </ul>
    </div>
  );
}
