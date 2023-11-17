import buttonBase from "@/assets/text_button/base.png";
import buttonHighlight from "@/assets/text_button/highlight.png";
import { InteractiveAsset } from "@/components/AssetComponent";
import { mixins } from "@/styles";
import { css } from "styled-components";
import { PropsWithChildren } from "react";

import { styles, TextButtonProps } from "./";

const buttonStyle = css`
    margin: clamp(44px, 2vw, 300px) clamp(15%, 2vh, 300px);
    font-size: {{ th}}
    > div {
        ${mixins.flexCenter}
    }
    > .base-asset {
        height: 100%;
    }

    > .hover-asset {
        height: 73%;
    }
`;

export const TextButton = (props: PropsWithChildren<TextButtonProps>) => {
    const { className, textStyle, onClick, children } = props;

    return (
        <InteractiveAsset
            src={buttonBase}
            alt={`button`}
            className={className}
            hoverSrc={buttonHighlight}
            themeOverride={buttonStyle}
            onClick={onClick}
        >
            <styles.TextButtonText style={textStyle}>{children}</styles.TextButtonText>
        </InteractiveAsset>
    );
};
