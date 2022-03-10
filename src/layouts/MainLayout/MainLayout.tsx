import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useWindowSize } from "../../hooks/useWindowSize";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [w] = useWindowSize();

  const handleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    if (w > 720) {
      if (collapsed) setCollapsed(false);
    }
  }, [w, collapsed]);

  return (
    <div>
      <Header collapsed={collapsed} onCollapsed={handleCollapsed} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
