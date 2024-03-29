import buttonBase from "@/assets/text_button/base.png";
import buttonHighlight from "@/assets/text_button/highlight.png";
import { InteractiveAsset } from "@/components/AssetComponent";
import { TextButtonProps } from "@/models/props";
import { ButtonText } from "@/styles/StyledText";
import { mixins } from "@/styles/mixins";
import { css } from "styled-components";

const assetExtension = css`
    margin: clamp(100px, 2vw, 300px) clamp(15%, 2vh, 300px);
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

export const TextButton = (props: TextButtonProps) => {
    const { text, className, textStyle, onClick } = props;

    return (
        <InteractiveAsset
            src={buttonBase}
            alt={`${text} button`}
            className={className}
            hoverSrc={buttonHighlight}
            themeOverride={assetExtension}
            onClick={onClick}
        >
            <ButtonText style={textStyle}>{text}</ButtonText>
        </InteractiveAsset>
    );
};
