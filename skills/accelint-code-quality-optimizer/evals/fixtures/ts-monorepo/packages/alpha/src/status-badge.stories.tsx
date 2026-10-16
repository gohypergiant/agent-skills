import { StatusBadge } from "./status-badge";

export default { title: "StatusBadge" };

export const Default = () => {
  const Wrapper = () => <StatusBadge label={"ok" as any} />;
  console.log("story");
  return <Wrapper />;
};
