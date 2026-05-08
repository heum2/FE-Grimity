import { useEffect } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react";
import Sidebar from "./Sidebar";
import type { SidebarProps } from "./Sidebar.types";
import { useAuthStore } from "@/states/authStore";

const meta = {
  title: "Common/Navigation/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", background: "##fff", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

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

const mobileProfileArgs = {
  user: { username: "체리마루", avatarSrc: undefined },
  profileActiveItem: undefined as SidebarProps["profileActiveItem"],
  onProfileLikedClick: () => {},
  onProfileSavedClick: () => {},
  onLogoutClick: () => {},
  onLoginClick: () => {},
  onClose: () => {},
} satisfies Partial<SidebarProps>;

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
};

export const DesktopLoggedIn: Story = {
  decorators: [loggedInDecorator],
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
  args: {
    onClose: () => {},
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};

export const TabletLoggedIn: Story = {
  decorators: [loggedInDecorator],
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
  args: {
    onClose: () => {},
  },
};

export const MobileGuest: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    onLoginClick: () => {},
    onClose: () => {},
  },
};

export const MobileLoggedIn: Story = {
  args: mobileProfileArgs,
  decorators: [loggedInDecorator],
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
