import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import TabView from "@/components/TabView";

const meta = {
  title: "Layout/TabView",
  component: TabView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    tabs: {
      description: "탭 목록 배열",
      control: { type: "object" },
    },
    activeTab: {
      description: "현재 활성화된 탭의 key",
      control: { type: "text" },
    },
    onTabChange: {
      description: "탭 변경 시 호출되는 콜백 함수",
      action: "tab changed",
    },
  },
} satisfies Meta<typeof TabView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { key: "weekly", label: "주간" },
      { key: "monthly", label: "월간" },
    ],
    activeTab: "weekly",
    onTabChange: () => {},
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    return (
      <TabView
        {...args}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          args.onTabChange?.(tab);
        }}
      />
    );
  },
  args: {
    tabs: [
      { key: "weekly", label: "주간" },
      { key: "monthly", label: "월간" },
    ],
    activeTab: "weekly",
    onTabChange: () => {},
  },
};

export const MultipleTabs: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    return (
      <TabView
        {...args}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          args.onTabChange?.(tab);
        }}
      />
    );
  },
  args: {
    tabs: [
      { key: "daily", label: "일간" },
      { key: "weekly", label: "주간" },
      { key: "monthly", label: "월간" },
      { key: "yearly", label: "연간" },
    ],
    activeTab: "weekly",
    onTabChange: () => {},
  },
};

export const LongLabels: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    return (
      <TabView
        {...args}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          args.onTabChange?.(tab);
        }}
      />
    );
  },
  args: {
    tabs: [
      { key: "popular", label: "인기순 정렬" },
      { key: "recent", label: "최신순 정렬" },
      { key: "trending", label: "트렌딩 정렬" },
    ],
    activeTab: "popular",
    onTabChange: () => {},
  },
};

export const SingleTab: Story = {
  args: {
    tabs: [{ key: "only", label: "유일한 탭" }],
    activeTab: "only",
    onTabChange: () => {},
  },
};
