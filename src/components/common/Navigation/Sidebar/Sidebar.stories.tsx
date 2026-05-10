import { useState, useEffect } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react";
import Sidebar from "./Sidebar";
import type { SidebarProps } from "./Sidebar.types";
import { useAuthStore } from "@/states/authStore";

const loggedInDecorator: Decorator = (Story) => {
  function Wrapper() {
    useEffect(() => {
      useAuthStore.getState().setIsLoggedIn(true);
      return () => {
        useAuthStore.getState().setIsLoggedIn(false);
      };
    }, []);
    return <Story />;
  }
  return <Wrapper />;
};

function InteractiveSidebar(props: SidebarProps) {
  const [activeRoute, setActiveRoute] = useState("/");
  const [profileActiveItem, setProfileActiveItem] = useState<"liked" | "saved" | undefined>();
  return (
    <Sidebar
      {...props}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      profileActiveItem={profileActiveItem}
      onProfileLikedClick={() => setProfileActiveItem((p) => (p === "liked" ? undefined : "liked"))}
      onProfileSavedClick={() => setProfileActiveItem((p) => (p === "saved" ? undefined : "saved"))}
    />
  );
}

const userData = { username: "체리마루", avatarSrc: undefined };

const meta = {
  title: "Common/Navigation/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  render: (args: SidebarProps) => <InteractiveSidebar {...args} />,
  args: {
    onClose: () => {},
    onLoginClick: () => {},
    onLogoutClick: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: "responsive" } },
};

export const DesktopLoggedIn: Story = {
  decorators: [loggedInDecorator],
  parameters: { viewport: { defaultViewport: "responsive" } },
  args: { user: userData },
};

export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: "tablet" } },
};

export const TabletLoggedIn: Story = {
  decorators: [loggedInDecorator],
  parameters: { viewport: { defaultViewport: "tablet" } },
  args: { user: userData },
};

export const MobileGuest: Story = {
  parameters: { viewport: { defaultViewport: "mobile2" } },
};

export const MobileLoggedIn: Story = {
  decorators: [loggedInDecorator],
  parameters: { viewport: { defaultViewport: "mobile2" } },
  args: { user: userData },
};
