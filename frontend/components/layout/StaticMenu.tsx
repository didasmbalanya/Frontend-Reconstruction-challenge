import { Menu } from "antd";
import ActiveLink from "@components/common/activeLink";

export default function RightMenu({ mode }) {
  return (
    <Menu
      mode={mode}
      className="header-menu"
      defaultSelectedKeys={["/"]}
      style={{
        background: "inherit",
      }}
    >
      <Menu.Item>
        <ActiveLink
          children={`About Us`}
          href="/about"
          className={null}
        />
      </Menu.Item>
      <Menu.Item>
        <ActiveLink
          children={`Work With Us`}
          href="/work-with-us"
          className={null}
        />
      </Menu.Item>
      <Menu.Item>
        <ActiveLink
          children={`Partner with Us`}
          href="/volunteer-with-us"
          className={null}
        />
      </Menu.Item>
    </Menu>
  );
}
