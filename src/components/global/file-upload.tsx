import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

export default function FileUpalod({ value, apiEndpoint, onChange }: Props) {
  const type = value?.split(".").pop();
  if (value)
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="w-40 h-40 relative">
            <Image
              alt="uploaded Image"
              src={value}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              target="_blank"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              rel="noopener_noreferrer"
            >
              View PDF
            </a>
            <Button variant="ghost">
              <X className="h-4 w-4" />
              Remove Logo
            </Button>
          </div>
        )}
      </div>
    );
  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          console.log("onChange", res);
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </div>
  );
}
