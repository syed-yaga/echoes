import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useSelector((state: RootState) => state.theme);
  console.log("ThemeProvider - Current theme:", theme);
  console.log("Applied className:", theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)]">
        {children}
      </div>
    </div>
  );
}
