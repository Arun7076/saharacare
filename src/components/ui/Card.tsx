import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-mint-200 shadow-sm p-5 md:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
