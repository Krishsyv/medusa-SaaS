import { ReactNode } from "react";

export const ColumnLayout = ({ children }: { children: ReactNode[] | ReactNode}) => (
  <div className="flex flex-col gap-x-4 gap-y-3 xl:flex-row xl:items-start">
    {Array.isArray(children) ? children.map((child, i) => (
      <div key={i} className="flex-1">
        {child}
      </div>
    )): (
      <div className="flex-1">
        {children}
      </div>
    )}
  </div>
);
