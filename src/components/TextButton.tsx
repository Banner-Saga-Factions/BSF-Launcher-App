import buttonBase from "@/assets/button-base.png";
import buttonHighlight from "@/assets/button-highlight.png";
import { InteractiveAsset } from "@/components/AssetComponent";
import { ITextButtonProps } from "@/models/props";
import { ButtonText } from "@/styles/StyledText";
import { css } from "styled-components";

const assetExtension = css`
    margin: clamp(100px, 2vw, 300px) clamp(15%, 2vh, 300px);

    > .base-asset {
        height: 100%;
    }

    > .hover-asset {
        height: 73%;
    }
`;

export const TextButton = (props: ITextButtonProps) => {
    const { text, className, textStyle, onClick } = props;

    return (
        <InteractiveAsset
            src={buttonBase}
            alt={`${text} button`}
            className={className}
            hoverSrc={buttonHighlight}
            themeOverride={assetExtension}
            onClick={onClick}
            inlineComponents={[<ButtonText style={textStyle}>{text}</ButtonText>]}
        />
    );
};
