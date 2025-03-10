import { LangType } from "@/i18n/request";
import FlexDiv from "@/components/reuse/FlexDiv";
import WorkPage from "./page";

export default function WorkLayout({
  children,
  locale,
  projectType,
}: {
  children: React.ReactNode;
  locale: LangType;
  projectType: string;
}) {
  return (
    <FlexDiv flex={{ direction: "column" }} width100 height100>
      <WorkPage params={Promise.resolve({ locale, projectType })} />
      {children}
    </FlexDiv>
  );
}
