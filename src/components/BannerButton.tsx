import buttonBase from "@/assets/banner_button/base.png";
import buttonHighlight from "@/assets/banner_button/highlight.png";
import buttonClick from "@/assets/banner_button/shade.png";
import { InteractiveAsset } from "@/components/AssetComponent";
import { TextButtonProps } from "@/models/props";
import { ButtonText } from "@/styles/StyledText";
import { mixins } from "@/styles/mixins";
import { css } from "styled-components";

const assetExtension = css`
    > div {
        ${mixins.flexCenter}
    }
    > .base-asset {
        height: 80%;
    }

    > .hover-asset {
        height: 78%;
    }
    > .click-asset {
        height: 80%;
    }
`;

export const BannerButton = (props: TextButtonProps) => {
    const { text, className, textStyle, onClick } = props;

    return (
        <InteractiveAsset
            src={buttonBase}
            alt={`${text} button`}
            className={className}
            hoverSrc={buttonHighlight}
            clickSrc={buttonClick}
            themeOverride={assetExtension}
            onClick={onClick}
        >
            <ButtonText style={textStyle}>{text}</ButtonText>
        </InteractiveAsset>
    );
};
