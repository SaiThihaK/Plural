import { useModal } from "@/provider/modal-provider";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type Props = {
  title: string;
  subheading: string;
  defaultOpen: boolean;
  children: React.ReactNode;
};

export default function CustomModal({
  title,
  subheading,
  defaultOpen,
  children,
}: Props) {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="overflow-scroll h-screen md:max-h-[700px] md:h-fit bg-card">
        <DialogHeader className="pt-2 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
