import type { FileDto } from "@/dto";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

const isImageFile = (fileName: string, fileUrl: string) => {
  const imgExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".bmp", ".svg"];
  const lowerName = (fileName || "").toLowerCase();
  const lowerUrl = (fileUrl || "").toLowerCase();
  return imgExts.some((ext) => lowerName.endsWith(ext) || lowerUrl.includes(ext));
};

const getPreviewUrl = (url: string) => {
  if (/\.(heic|heif)$/i.test(url)) {
    return url.replace(/\.(heic|heif)$/i, ".jpg");
  }
  return url;
};

const DocumentFile = ({ documents }: { documents: FileDto[] }) => {
  const [selectedImage, setSelectedImage] = useState<FileDto | null>(null);

  if (!documents || documents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center text-gray-500 italic">
        Không có tài liệu nào
      </div>
    );
  }

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {documents.map((doc) => {
          const isImg = isImageFile(doc.fileName, doc.fileUrl);
          if (isImg) {
            return (
              <div
                key={doc.id}
                className="group relative flex h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-xs"
              >
                <img
                  src={getPreviewUrl(doc.fileUrl)}
                  alt={doc.fileName}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button
                    icon="pi pi-eye"
                    tooltip="Xem chi tiết"
                    tooltipOptions={{ position: "top" }}
                    className="w-10!h-10! flex! items-center! justify-center! border-0! p-0! text-white! shadow-md! hover:bg-transparent!"
                    outlined
                    onClick={() => setSelectedImage(doc)}
                  />
                  <Button
                    icon="pi pi-download"
                    tooltip="Tải xuống"
                    tooltipOptions={{ position: "top" }}
                    className="w-10!h-10! flex! items-center! justify-center! border-0! p-0! text-white! shadow-md! hover:bg-transparent!"
                    onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
                    outlined
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={doc.id}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm transition-colors hover:bg-white"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <i className="pi pi-file-pdf text-2xl text-red-500"></i>
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium text-gray-800" title={doc.fileName}>
                    {doc.fileName}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  icon="pi pi-eye"
                  tooltip="Xem"
                  tooltipOptions={{ position: "top" }}
                  className="p-button-rounded p-button-text p-button-info"
                  onClick={() => handleView(doc.fileUrl)}
                />
                <Button
                  icon="pi pi-download"
                  tooltip="Tải xuống"
                  tooltipOptions={{ position: "top" }}
                  className="p-button-rounded p-button-text p-button-success"
                  onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        header={selectedImage?.fileName || "Chi tiết hình ảnh"}
        visible={!!selectedImage}
        onHide={() => setSelectedImage(null)}
        maximizable
        modal
        className="w-[90vw] md:w-[70vw] lg:w-[50vw]"
        contentClassName="p-4 flex items-center justify-center min-h-[300px]"
        headerClassName="border-b"
      >
        {selectedImage && (
          <img
            src={getPreviewUrl(selectedImage.fileUrl)}
            alt={selectedImage.fileName}
            className="max-h-[70vh] max-w-full rounded object-contain shadow-md"
          />
        )}
      </Dialog>
    </>
  );
};

export { DocumentFile };
