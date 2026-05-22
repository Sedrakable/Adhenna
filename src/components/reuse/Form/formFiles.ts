import { EncodedFileType } from "./formTypes";

export const encodeFiles = (files: File[]): Promise<EncodedFileType[]> =>
  Promise.all(
    files.map(
      (file) =>
        new Promise<EncodedFileType>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (event) => {
            const data = (event.target?.result as string)?.split(",")[1] || "";
            resolve({
              name: file.name,
              type: file.type,
              data,
            });
          };

          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
    ),
  );
