import React from "react";
import { IconType } from "../reuse/Icon";
import { Heading } from "../reuse/Heading";
import { IconButton } from "../reuse/IconButton";
import FlexDiv from "../reuse/FlexDiv";
import { ICta, IExternalLink, ISocials } from "../../data.d";

export const Socials: React.FC<ISocials> = ({ links }) => {
  return (
    <FlexDiv gapArray={[5]} wrap flex={{ x: "flex-start" }} as="ul">
      {links?.map((link: IExternalLink, key) => {
        return (
          true && (
            <li key={key}>
              <IconButton
                href={link?.link}
                iconProps={{
                  icon: link.text as IconType,
                  size: "regular",
                  color: "light_burgundy",
                }}
                target="_blank"
                aria-label={link.text}
              />
            </li>
          )
        );
      })}
    </FlexDiv>
  );
};
