import { ReactNode } from "react";
import { Link } from "react-router-dom";

type FooterSectionProps = {
  className?: string;
  title: string;
  children: ReactNode;
};

function FooterSection({
  className = "",
  title,
  children,
}: FooterSectionProps) {
  return (
    <div className={className}>
      <h2 className="relative mb-[14px] inline-block text-2xl text-white before:contents-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-[50px] before:h-[2px] before:bg-[red]">
        {title}
      </h2>
      <div className="text-[#999]">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <div className="bg-[#111]">
      <footer className="p-[40px] md:py-[50px] md:px-[100px] flex justify-between flex-wrap space-x-[30px]">
        <FooterSection className="md:w-[40%]" title="Vialand">
          <p className="text-[#999]">
            Mua bán cho thuê nhà đất TPHCM giá rẻ, vị trí thuận tiện đa dạng
            diện tích hỗ trợ ngân hàng trả góp. Thông tin bất động sản chính chủ
            tất cả loại hình từ biệt thự, nhà phố, đất nền, căn hộ chung cư cao
            cấp cho đến các dự án bất động sản lớn. Giao dịch chuyển nhượng tài
            sản uy tín, rõ ràng, sổ đỏ đầy đủ pháp lý cập nhập liên tục thường
            xuyên mới nhất năm 2022.
          </p>
        </FooterSection>
        <FooterSection className="hidden md:block" title="Quick Links">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link className="hover:text-white" to="/">
                Trung tâm trợ giúp
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                An toàn mua bán
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                Quy định cần biết
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                Quy chế quyền riêng tư
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                Liên hệ hỗ trợ
              </Link>
            </li>
          </ul>
        </FooterSection>
        <FooterSection className="hidden md:block" title="Contact Info">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link className="hover:text-white" to="/">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                Tin tức
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                Truyền thông
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                Blog
              </Link>
            </li>
          </ul>
        </FooterSection>
      </footer>
      <div className="py-[10px] px-[100px] bg-[#161616]">
        <p className="text-[#999] text-center">
          Copyright © 2020 ViaLand. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
