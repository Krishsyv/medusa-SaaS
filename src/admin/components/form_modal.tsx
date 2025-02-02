import { Button, FocusModal, Heading, Text } from "@medusajs/ui";

type FormModalProps = {
  submitTxt: string;
  heading: string;
  text?: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: () => void;
};

export const FormModal = ({
  children,
  submitTxt,
  heading,
  text = "",
  open,
  setOpen,
  onSave,
}: FormModalProps) => {
  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <form onSubmit={onSave}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button onClick={onSave}>{submitTxt}</Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>{heading}</Heading>
                {text && <Text className="text-ui-fg-subtle">{text}</Text>}
              </div>
              {children}
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </form>
    </FocusModal>
  );
};
