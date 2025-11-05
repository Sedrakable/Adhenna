import { TextWrapper } from "@/components/reuse/containers/TextWrapper/TextWrapper";
import FlexDiv from "@/components/reuse/FlexDiv";
import { Heading } from "@/components/reuse/Heading";
import { PortableTextContent } from "@/components/reuse/Paragraph/PortableTextContent";
import { FC } from "react";

export interface NotificationProps {
  title: string;
  desc: any;
}
export const Notification: FC<NotificationProps> = ({ title, desc }) => {
  return (
    <TextWrapper version={3} variant="big" animate={false}>
      <FlexDiv flex={{ direction: "column" }} gapArray={[2]}>
        <Heading
          as="h5"
          textAlign="center"
          level="5"
          color="burgundy"
          weight={500}
        >
          {title}
        </Heading>
        <div>
          <PortableTextContent
            value={desc}
            color="darkest-burgundy"
            textAlign="center"
            level="regular"
          />
        </div>
      </FlexDiv>
    </TextWrapper>
  );
};
