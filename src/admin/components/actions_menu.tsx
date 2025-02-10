import { DropdownMenu, IconButton, clx } from "@medusajs/ui";
import { EllipsisHorizontal } from "@medusajs/icons";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

export type Action = {
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  to?: never;
};

export type ActionGroup = {
  actions: Action[];
};

export const ActionMenu = ({ groups }: { groups: ActionGroup[] }) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton size="small" variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {groups.map((group, index) => {
          if (!group.actions.length) {
            return null;
          }

          const isLast = index === groups.length - 1;

          return (
            <DropdownMenu.Group key={index}>
              {group.actions.map(
                (
                  { icon, label, disabled = false, onClick = () => {}, to },
                  index
                ) => {
                  if (onClick) {
                    return (
                      <DropdownMenu.Item
                        disabled={disabled}
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClick();
                        }}
                        className={clx(
                          "[&_svg]:text-ui-fg-subtle flex items-center gap-x-2",
                          {
                            "[&_svg]:text-ui-fg-disabled": disabled,
                          }
                        )}
                      >
                        {icon}
                        <span>{label}</span>
                      </DropdownMenu.Item>
                    );
                  }
                  if (to) {
                    return (
                      <div key={index}>
                        <DropdownMenu.Item
                          className={clx(
                            "[&_svg]:text-ui-fg-subtle flex items-center gap-x-2",
                            {
                              "[&_svg]:text-ui-fg-disabled": disabled,
                            }
                          )}
                          asChild
                          disabled={disabled}
                        >
                          {
                            <Link to={to} onClick={(e) => e.stopPropagation()}>
                              {icon}
                              <span>{label}</span>
                            </Link>
                          }
                        </DropdownMenu.Item>
                      </div>
                    );
                  }
                }
              )}
              {!isLast && <DropdownMenu.Separator />}
            </DropdownMenu.Group>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
