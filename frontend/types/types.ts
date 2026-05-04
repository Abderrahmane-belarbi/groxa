import type { ImageSourcePropType } from "react-native";

export type AppTab = {
  name: string;
  title: string;
  icon: ImageSourcePropType;
};

export type TabIconProps = {
  focused: boolean;
  icon: ImageSourcePropType;
};

export type Subscription = {
  id: string;
  icon: ImageSourcePropType;
  name: string;
  plan?: string;
  category?: string;
  paymentMethod?: string;
  status?: string;
  startDate?: string;
  price: number;
  currency?: string;
  billing: string;
  renewalDate?: string;
  color?: string;
};

export type SubscriptionCardProps = {
  expanded: boolean;
  onPress: () => void;
  onCancelPress?: () => void;
  isCancelling?: boolean;
};

export type UpcomingSubscription = {
  id: string;
  icon: ImageSourcePropType;
  name: string;
  price: number;
  currency?: string;
  daysLeft: number;
};

export type UpcomingSubscriptionCardProps = Omit<UpcomingSubscription, "id">;

export type ListHeadingProps = {
  title: string;
};
